import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
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

    // Determine which subdomain we are on
    const isHotelSubdomain = host.startsWith('hotels.');
    const isAdminSubdomain = host.startsWith('admin.');

    // 1. Redirect hotel routes from admin to hotel subdomain
    if (pathname.startsWith('/hotels/') && isAdminSubdomain) {
        return NextResponse.redirect(new URL(pathname, 'https://hotels.thehotelmedia.com'));
    }

    // 2. Redirect admin login from hotel subdomain to hotel login
    // This is crucial for logout redirection
    if (pathname === '/admin/login' && isHotelSubdomain) {
        return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
    }

    // 3. Root path (/) redirection logic
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

    // 4. Authentication and Role-based redirects
    if (token) {
        // Redirection for authenticated users hitting login pages
        if (pathname === "/admin/login" || pathname === HOTEL_LOGIN_ROUTE || pathname === "/") {
            const redirectUrl = token.role === Role.ADMIN ? DASHBOARD : HOTEL_DASHBOARD;
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }

        // Role-based access control cross-subdomain
        if (token.role === Role.ADMIN && pathname.startsWith('/hotels/')) {
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        if (token.role !== Role.ADMIN && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
    } else {
        // 5. Unauthenticated protection

        // On hotel subdomain, force hotel login for any protected route
        if (isHotelSubdomain) {
            if (pathname !== HOTEL_LOGIN_ROUTE && (pathname.startsWith('/hotels/') || isDashboardEndpoint || pathname === '/')) {
                return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
            }
        }

        // General protection for dashboard and hotel routes
        if (isDashboardEndpoint || (pathname.startsWith('/hotels/') && pathname !== HOTEL_LOGIN_ROUTE)) {
            // Determine the correct login URL
            if (pathname.startsWith('/hotels/')) {
                return NextResponse.redirect('https://hotels.thehotelmedia.com/hotels/login');
            }
            return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
        }
    }

    return NextResponse.next();
}
