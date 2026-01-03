import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import { DASHBOARD, HOTEL_DASHBOARD, HOTEL_LOGIN_ROUTE, HOTEL_LOGIN_URL, LOGIN_ROUTE, Role } from './types/auth';
export { default } from 'next-auth/middleware';

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


// // ┌ ƒ /                                    169 kB          268 kB
// '/_not-found                          878 B          88.2 kB
// '/about-us                            150 B          87.5 kB
// '/admin/auth/forgot-password          3.52 kB         137 kB
// '/admin/login                         2.35 kB         116 kB
// '/api/auth/[...nextauth]              0 B                0 B
// // ├ ○ /apple-app-site-association          0 B                0 B
// '/hotels/booking-management           156 B           156 kB
// '/hotels/financial/bank-detail        156 B           156 kB
// '/hotels/financial/transaction        155 B           156 kB
// '/hotels/login                        4.43 kB         106 kB
// '/hotels/overview                     156 B           156 kB
// '/hotels/price-control                156 B           156 kB
// '/hotels/profile                      156 B           156 kB
// '/hotels/room-management              156 B           156 kB
// '/hotels/support                      157 B           156 kB
// '/privacy-policy                      150 B          87.5 kB
// '/terms-and-conditions                150 B          87.5 kB

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname, hostname } = req.nextUrl;

    // Redirection logic for hotel subdomain
    // If accessing hotel routes on the admin subdomain, redirect to the hotel subdomain
    if (pathname.startsWith('/hotels/') && hostname.includes('admin.thehotelmedia.com')) {
        const hotelUrl = new URL(pathname, 'https://hotels.thehotelmedia.com');
        hotelUrl.search = req.nextUrl.search;
        return NextResponse.redirect(hotelUrl);
    }

    // If accessing admin login on hotel subdomain, redirect to hotel login
    // This handles cases where NextAuth defaults to /admin/login (e.g., after logout)
    if (pathname === '/admin/login' && hostname.includes('hotels.thehotelmedia.com')) {
        return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
    }

    // Root path (/) redirection logic based on hostname
    if (pathname === '/') {
        if (hostname.includes('hotels.thehotelmedia.com')) {
            return NextResponse.redirect(new URL(token ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE, req.url));
        }
        if (hostname.includes('admin.thehotelmedia.com')) {
            return NextResponse.redirect(new URL(token ? DASHBOARD : LOGIN_ROUTE, req.url));
        }
    }

    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
        return regex.test(pathname);
    });

    // Handle authentication and role-based redirects
    if (token) {
        // Redirection for authenticated users hitting login or root pages
        if (pathname === "/admin/login" || pathname === "/") {
            const redirectUrl = token.role === Role.ADMIN ? DASHBOARD : HOTEL_DASHBOARD;
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }

        // Role-based access control
        if (token.role === Role.ADMIN && !isDashboardEndpoint && pathname.startsWith('/hotels/')) {
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        if (token.role !== Role.ADMIN && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
    } else {
        // Handle unauthenticated users

        // Force hotel login on hotels subdomain for any protected or landing route
        if (hostname.includes('hotels.thehotelmedia.com')) {
            if (pathname !== HOTEL_LOGIN_ROUTE && (isDashboardEndpoint || pathname.startsWith('/hotels/') || pathname === '/')) {
                return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
            }
        }

        // General protection for dashboard and hotel routes
        if (isDashboardEndpoint || (pathname.startsWith('/hotels/') && pathname !== HOTEL_LOGIN_ROUTE)) {
            const loginRedirect = pathname.startsWith('/hotels/') ? HOTEL_LOGIN_URL : new URL(LOGIN_ROUTE, req.url).toString();
            return NextResponse.redirect(loginRedirect);
        }
    }

    return NextResponse.next();
}

