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
    const { pathname } = req.nextUrl;
    const host = req.headers.get('host') || "";
    const cookieStore = await cookies();

    // Determine current subdomain status
    const isHotelSubdomain = host.startsWith('hotels.');
    const isAdminSubdomain = host.startsWith('admin.');
    const isApexDomain = !isHotelSubdomain && !isAdminSubdomain;

    const isHotelRoute = pathname.startsWith('/hotels/');

    // 0. Login page redirects - check specific cookies for each login page (must be first)
    if (pathname === "/admin/login") {
        const adminSessionToken = cookieStore.get('AdminSessionToken');
        if (adminSessionToken) {
            // Admin is logged in, redirect to dashboard
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        // No admin session, allow access to admin login page
        return NextResponse.next();
    }

    if (pathname === HOTEL_LOGIN_ROUTE) {
        const userSessionToken = cookieStore.get('SessionToken');
        console.log('[MIDDLEWARE] Hotel login route check:', {
            pathname,
            hasSessionToken: !!userSessionToken,
            sessionTokenValue: userSessionToken?.value ? 'exists' : 'missing',
            host
        });
        if (userSessionToken) {
            // Hotel/user is logged in, redirect to hotel dashboard
            console.log('[MIDDLEWARE] SessionToken found, redirecting to dashboard');
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
        // No hotel session, allow access to hotel login page
        console.log('[MIDDLEWARE] No SessionToken, allowing access to login page');
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

    // 3. Hotel Route Authentication - Check SessionToken cookie directly (NOT NextAuth)
    if (isHotelRoute && pathname !== HOTEL_LOGIN_ROUTE) {
        const hotelSessionToken = cookieStore.get('SessionToken');
        console.log('[MIDDLEWARE] Hotel route authentication check:', {
            pathname,
            isHotelRoute,
            hasSessionToken: !!hotelSessionToken,
            sessionTokenValue: hotelSessionToken?.value ? 'exists' : 'missing',
            host
        });
        if (!hotelSessionToken) {
            // No SessionToken cookie, redirect to hotel login
            console.log('[MIDDLEWARE] No SessionToken found, redirecting to login');
            return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
        }
        // SessionToken exists, allow access to hotel routes
        console.log('[MIDDLEWARE] SessionToken found, allowing access to hotel route');
        return NextResponse.next();
    }

    // 4. Admin Route Authentication - Use NextAuth token for admin routes
    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
        return regex.test(pathname);
    });

    // Only check NextAuth token for admin routes
    const token = await getToken({ req });

    // 5. Subdomain-Specific Root Redirection
    if (pathname === '/') {
        if (isHotelSubdomain) {
            const hotelSessionToken = cookieStore.get('SessionToken');
            console.log('[MIDDLEWARE] Root path on hotel subdomain:', {
                hasSessionToken: !!hotelSessionToken,
                redirectingTo: hotelSessionToken ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE
            });
            return NextResponse.redirect(new URL(hotelSessionToken ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE, req.url));
        }
        if (isAdminSubdomain) {
            console.log('[MIDDLEWARE] Root path on admin subdomain:', {
                hasToken: !!token,
                redirectingTo: token ? DASHBOARD : LOGIN_ROUTE
            });
            return NextResponse.redirect(new URL(token ? DASHBOARD : LOGIN_ROUTE, req.url));
        }
    }

    // 6. Admin Authentication & Role-based access
    if (token) {
        // Redirection for authenticated admin users hitting root
        if (pathname === "/" && !isApexDomain && isAdminSubdomain) {
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }

        // Protect admin dashboard routes - only allow admin role
        if (isDashboardEndpoint && token.role !== Role.ADMIN) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
    } else {
        // 7. Unauthenticated protection for admin routes

        // On admin subdomain, protect dashboard routes
        if (isAdminSubdomain && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
        }

        // Protect admin dashboard routes regardless of subdomain
        if (isDashboardEndpoint && !isHotelRoute) {
            return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
        }
    }

    return NextResponse.next();
}
