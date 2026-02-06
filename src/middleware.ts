import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import { DASHBOARD, HOTEL_DASHBOARD, HOTEL_LOGIN_ROUTE, LOGIN_ROUTE, Role } from './types/auth';

const dashboardEndpoints = [
    '/dashboard',
    '/users/',
    '/users/:path*',
    '/posts',
    '/booking',
    '/booking/:path*',
    '/reports',
    '/coupons',
    '/subscriptions',
    '/subscriptions/:path*',
    '/reviews',
    '/reviews/:path*',
    '/help-and-support',
    '/help-and-support/:path*',
    '/profile',
];

export const config = {
    matcher: [
        '/dashboard',
        '/users/',
        '/users/:path*',
        '/posts',
        '/booking',
        '/booking/:path*',
        '/reports',
        '/coupons',
        '/subscriptions',
        '/subscriptions/:path*',
        '/reviews',
        '/reviews/:path*',
        '/help-and-support',
        '/help-and-support/:path*',
        '/profile',
        '/hotels/:path*',
        '/admin/:path*',
        '/',
    ],
};

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // Behind proxies/CDNs, `host` can be unreliable. Prefer forwarded host.
    const forwardedHost = req.headers.get('x-forwarded-host');
    const host = (forwardedHost || req.headers.get('host') || '')
        .split(',')[0]
        .trim()
        .toLowerCase();

    const forwardedProto = (req.headers.get('x-forwarded-proto') || '')
        .split(',')[0]
        .trim()
        .toLowerCase();

    const isDevHost =
        host.includes('localhost') ||
        host.startsWith('127.0.0.1') ||
        host.startsWith('0.0.0.0') ||
        host === '';

    const publicProto = forwardedProto || (isDevHost ? 'http' : 'https');
    const publicOrigin = host ? `${publicProto}://${host}` : req.nextUrl.origin;

    const isHotelSubdomain = host.startsWith('hotels.');
    const isAdminSubdomain = host.startsWith('admin.');
    const isApexDomain = !isHotelSubdomain && !isAdminSubdomain;

    const isHotelRoute = pathname.startsWith('/hotels/');
    const isAdminRoute = pathname.startsWith('/admin/');

    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        // Avoid dynamic RegExp construction (can break if patterns aren't escaped correctly).
        // We only need simple matching for `:path*` (prefix match).
        if (endpoint.includes(':path*')) {
            const base = endpoint.replace(':path*', '');
            return pathname.startsWith(base);
        }
        // Normalize trailing slash patterns like "/users/" to also match "/users"
        if (endpoint.endsWith('/') && pathname === endpoint.slice(0, -1)) return true;
        return pathname === endpoint;
    });

    const redirectSameOrigin = (toPathname: string) => {
        const url = req.nextUrl.clone();
        url.pathname = toPathname;
        url.search = '';
        return NextResponse.redirect(url);
    };

    // 1) Apex domain: hotel routes must be served from hotels subdomain
    if (isApexDomain && !isDevHost && isHotelRoute) {
        const target = new URL(`${pathname}${search}`, 'https://hotels.thehotelmedia.com');
        return NextResponse.redirect(target);
    }

    // 2) Subdomain/path mismatch corrections (the issue you reported)
    if (isAdminSubdomain && isHotelRoute) {
        return redirectSameOrigin(LOGIN_ROUTE);
    }
    if (isHotelSubdomain && (isAdminRoute || isDashboardEndpoint)) {
        return redirectSameOrigin(HOTEL_LOGIN_ROUTE);
    }

    const cookieStore = req.cookies;

    const adminSessionToken = cookieStore.get('AdminSessionToken')?.value;
    const adminAccessToken = cookieStore.get('X-Admin-Access-Token')?.value;
    const hotelSessionToken = cookieStore.get('SessionToken')?.value;
    const hotelAccessToken = cookieStore.get('X-Access-Token')?.value;

    // NextAuth token (for role/accountType when present)
    const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || 'rCpp0FxsnpdW76Nyb7BUdddd',
    });

    const role = (nextAuthToken as any)?.role as Role | undefined;
    const accountType = (nextAuthToken as any)?.accountType as string | undefined;

    const isAdminAuthed = !!adminSessionToken || !!adminAccessToken || role === Role.ADMIN;
    const isHotelAuthed = !!hotelSessionToken || !!hotelAccessToken || accountType === 'business';

    // 3) Prevent cookie cross-contamination (admin cookies on hotel context & vice versa)
    if ((isHotelSubdomain || isHotelRoute) && pathname !== HOTEL_LOGIN_ROUTE) {
        if ((adminSessionToken || adminAccessToken) && (hotelSessionToken || hotelAccessToken)) {
            const response = NextResponse.next();
            response.cookies.delete('AdminSessionToken');
            response.cookies.delete('X-Admin-Access-Token');
            return response;
        }
    }
    if (isAdminSubdomain && pathname !== LOGIN_ROUTE) {
        if ((hotelSessionToken || hotelAccessToken) && (adminSessionToken || adminAccessToken)) {
            const response = NextResponse.next();
            response.cookies.delete('SessionToken');
            response.cookies.delete('X-Access-Token');
            return response;
        }
    }

    // 4) Root redirects per subdomain
    if (pathname === '/' && isAdminSubdomain) {
        return redirectSameOrigin(isAdminAuthed ? DASHBOARD : LOGIN_ROUTE);
    }
    if (pathname === '/' && isHotelSubdomain) {
        return redirectSameOrigin(isHotelAuthed ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE);
    }
    if (pathname === '/' && isApexDomain) {
        return NextResponse.next();
    }

    // 5) Login pages: if already authed, bounce to dashboards
    if (pathname === LOGIN_ROUTE && isAdminAuthed) {
        return redirectSameOrigin(DASHBOARD);
    }
    if (pathname === HOTEL_LOGIN_ROUTE && isHotelAuthed) {
        return redirectSameOrigin(HOTEL_DASHBOARD);
    }

    // 6) Protect admin dashboard endpoints
    if (isDashboardEndpoint) {
        if (!isAdminAuthed) return redirectSameOrigin(LOGIN_ROUTE);
        if (role && role !== Role.ADMIN) return redirectSameOrigin(HOTEL_DASHBOARD);
    }

    // 7) Protect hotel routes (excluding hotel login)
    if (isHotelRoute && pathname !== HOTEL_LOGIN_ROUTE) {
        if (!isHotelAuthed) return redirectSameOrigin(HOTEL_LOGIN_ROUTE);
        if (role === Role.ADMIN) return redirectSameOrigin(DASHBOARD);
    }

    return NextResponse.next();
}
