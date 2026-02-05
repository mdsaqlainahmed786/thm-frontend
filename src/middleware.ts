import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { DASHBOARD, HOTEL_DASHBOARD, HOTEL_LOGIN_ROUTE, HOTEL_LOGIN_URL, LOGIN_ROUTE, Role } from './types/auth';

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
    '/profile'
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
        '/hotels/profile',
        '/hotels/price-control',
        '/hotels/booking-management',
        '/hotels/table-management',
        '/hotels/financial/:path*',
        '/hotels/overview',
        '/hotels/room-management',
        '/hotels/support',
        '/hotels/login',
        '/admin/login',
        '/',
    ],
};

export async function middleware(req: NextRequest) {
    try {
        const { pathname } = req.nextUrl;
        // Behind proxies/CDNs, `host` can be unreliable. Prefer forwarded host.
        const forwardedHost = req.headers.get('x-forwarded-host');
        const host = (forwardedHost || req.headers.get('host') || "")
            .split(',')[0]
            .trim()
            .toLowerCase();
        const cookieStore = await cookies();

        // Determine current subdomain status
        const isHotelSubdomain = host.startsWith('hotels.');
        const isAdminSubdomain = host.startsWith('admin.');
        const isApexDomain = !isHotelSubdomain && !isAdminSubdomain;

        const isHotelRoute = pathname.startsWith('/hotels/');

        // On apex domain, hotel routes must be served from the hotels subdomain.
        const isDevHost = host.includes('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0');
        if (isApexDomain && !isDevHost && isHotelRoute) {
            const target = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, 'https://hotels.thehotelmedia.com');
            return NextResponse.redirect(target);
        }
        
        // Clear admin cookies if we're on hotel subdomain/route to prevent cross-contamination
        if ((isHotelSubdomain || isHotelRoute) && pathname !== HOTEL_LOGIN_ROUTE) {
            const adminSessionToken = cookieStore.get('AdminSessionToken');
            const adminAccessToken = cookieStore.get('X-Admin-Access-Token');
            const hotelSessionToken = cookieStore.get('SessionToken');
            
            if ((adminSessionToken || adminAccessToken) && hotelSessionToken) {
                const response = NextResponse.next();
                response.cookies.delete('AdminSessionToken');
                response.cookies.delete('X-Admin-Access-Token');
                return response;
            }
        }
        
        // Clear hotel cookies if we're on admin subdomain to prevent cross-contamination
        if (isAdminSubdomain && pathname !== LOGIN_ROUTE) {
            const hotelSessionToken = cookieStore.get('SessionToken');
            const hotelAccessToken = cookieStore.get('X-Access-Token');
            const adminSessionToken = cookieStore.get('AdminSessionToken');
            
            if ((hotelSessionToken || hotelAccessToken) && adminSessionToken) {
                const response = NextResponse.next();
                response.cookies.delete('SessionToken');
                response.cookies.delete('X-Access-Token');
                return response;
            }
        }

        // Read NextAuth token once
        const nextAuthToken = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET || "rCpp0FxsnpdW76Nyb7BUdddd",
        });

        // Login page redirects
        if (pathname === "/admin/login") {
            const adminSessionToken = cookieStore.get('AdminSessionToken');
            if (adminSessionToken) {
                return NextResponse.redirect(new URL(DASHBOARD, req.url));
            }
            return NextResponse.next();
        }

        if (pathname === HOTEL_LOGIN_ROUTE) {
            const userSessionToken = cookieStore.get('SessionToken');
            const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
            if (userSessionToken || hasValidNextAuthForHotel) {
                return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
            }
            return NextResponse.next();
        }

        // Apex Domain Handling
        if (isApexDomain && !isDevHost && pathname === '/') {
            return NextResponse.next();
        }

        // Cross-Subdomain Correction
        if (isHotelRoute && isAdminSubdomain && !host.includes('localhost')) {
            return NextResponse.redirect(new URL(pathname, 'https://hotels.thehotelmedia.com'));
        }

        // Hotel Route Authentication
        if (isHotelRoute && pathname !== HOTEL_LOGIN_ROUTE) {
            const hotelSessionToken = cookieStore.get('SessionToken');
            const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
            if (!hotelSessionToken && !hasValidNextAuthForHotel) {
                return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
            }
            return NextResponse.next();
        }

        // Admin Route Authentication
        const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
            const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
            return regex.test(pathname);
        });

        const token = nextAuthToken;

        // Subdomain-Specific Root Redirection
        if (pathname === '/') {
            if (isHotelSubdomain) {
                const hotelSessionToken = cookieStore.get('SessionToken');
                const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
                return NextResponse.redirect(new URL((hotelSessionToken || hasValidNextAuthForHotel) ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE, req.url));
            }
            if (isAdminSubdomain) {
                return NextResponse.redirect(new URL(token ? DASHBOARD : LOGIN_ROUTE, req.url));
            }
        }

        // Admin Authentication & Role-based access
        if (token) {
            if (pathname === "/" && !isApexDomain && isAdminSubdomain) {
                return NextResponse.redirect(new URL(DASHBOARD, req.url));
            }

            if (isDashboardEndpoint && token.role !== Role.ADMIN) {
                return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
            }
        } else {
            // Unauthenticated protection for admin routes
            if (isAdminSubdomain && isDashboardEndpoint) {
                return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
            }

            if (isDashboardEndpoint && !isHotelRoute) {
                return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        // Log error but don't crash - allow request to proceed
        console.error('[MIDDLEWARE] Error:', error);
        return NextResponse.next();
    }
}
