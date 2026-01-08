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
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;
    const host = req.headers.get('host') || "";

    // Determine current subdomain status
    const isHotelSubdomain = host.startsWith('hotels.');
    const isAdminSubdomain = host.startsWith('admin.');
    const isApexDomain = !isHotelSubdomain && !isAdminSubdomain;

    const isHotelRoute = pathname.startsWith('/hotels/');

    // 0. Login page redirects - check specific cookies for each login page (must be first)
    if (pathname === "/admin/login") {
        const cookieStore = await cookies();
        const adminSessionToken = cookieStore.get('AdminSessionToken');
        if (adminSessionToken) {
            // Admin is logged in, redirect to dashboard
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        // No admin session, allow access to admin login page
        return NextResponse.next();
    }

    if (pathname === HOTEL_LOGIN_ROUTE) {
        const cookieStore = await cookies();
        const userSessionToken = cookieStore.get('SessionToken');
        if (userSessionToken) {
            // Hotel/user is logged in, redirect to hotel dashboard
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
        // No hotel session, allow access to hotel login page
        return NextResponse.next();
    }

    // 1. Apex Domain Handling
    // If on the apex domain, we only redirect if they are trying to access /hotels/ paths
    if (isApexDomain && !host.includes('localhost')) {
        if (isHotelRoute) {
            return NextResponse.redirect(new URL(pathname, 'https://hotels.thehotelmedia.com'));
        }
        // Allow root (/) and other non-hotel paths to load the landing page
        if (pathname === '/') {
            return NextResponse.next();
        }
    }

    // 2. Cross-Subdomain Correction
    // Force hotel routes to the hotels subdomain if accessed from admin
    if (isHotelRoute && isAdminSubdomain && !host.includes('localhost')) {
        return NextResponse.redirect(new URL(pathname, 'https://hotels.thehotelmedia.com'));
    }

    // 3. Subdomain-Specific Root Redirection
    if (pathname === '/') {
        if (isHotelSubdomain) {
            return NextResponse.redirect(new URL(token ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE, req.url));
        }
        if (isAdminSubdomain) {
            return NextResponse.redirect(new URL(token ? DASHBOARD : LOGIN_ROUTE, req.url));
        }
    }

    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
        return regex.test(pathname);
    });

    // 4. Authentication & Role-based access
    if (token) {
        // Redirection for authenticated users hitting root on their subdomains
        if (pathname === "/" && !isApexDomain) {
            const redirectUrl = (token.role === Role.ADMIN) ? DASHBOARD : HOTEL_DASHBOARD;
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }

        // Prevent Admin users from accessing Hotel routes and vice-versa
        if (token.role === Role.ADMIN && isHotelRoute) {
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        if (token.role !== Role.ADMIN && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
    } else {
        // 5. Unauthenticated protection

        // On hotel subdomain, EVERYTHING requires hotel login (except the login page itself)
        if (isHotelSubdomain && pathname !== HOTEL_LOGIN_ROUTE) {
            return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
        }

        // On admin subdomain, protect dashboard routes
        if (isAdminSubdomain && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
        }

        // Protect hotel routes regardless of subdomain (if not on hotel login Page)
        if (isHotelRoute && pathname !== HOTEL_LOGIN_ROUTE) {
            // Use current request URL for redirect to support localhost development
            return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
        }
    }

    return NextResponse.next();
}
