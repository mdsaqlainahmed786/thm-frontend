import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import { DASHBOARD, HOTEL_DASHBOARD, Role } from './types/auth';
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
    const { pathname } = req.nextUrl;
    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        // Check if the pathname matches the endpoint, including wildcard match for :path*
        const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
        return regex.test(pathname);
    });

    // If user is authenticated and trying to access login or landing page, redirect to dashboard
    if (token) {
        // Redirect authenticated admin users from login/landing pages to dashboard
        if (token.role === Role.ADMIN && (pathname === "/admin/login" || pathname === "/")) {
            return NextResponse.redirect(new URL(DASHBOARD, req.url));
        }
        // Redirect authenticated hotel users from login/landing pages to hotel dashboard
        if (token.role !== Role.ADMIN && (pathname === "/admin/login" || pathname === "/")) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
        }
    }

    // If no token and trying to access protected routes, redirect to login
    if (!token) {
        // Only redirect to login if accessing protected dashboard endpoints
        if (isDashboardEndpoint || pathname.startsWith('/hotels/')) {
            return NextResponse.redirect(new URL('/api/auth/signin', req.url));
        }
        // Allow access to login and landing pages if not authenticated
        return NextResponse.next();
    }

    // Role-based access control for dashboard endpoints
    if (token.role === Role.ADMIN && !isDashboardEndpoint && pathname.startsWith('/hotels/')) {
        return NextResponse.redirect(new URL(DASHBOARD, req.url));
    }
    if (token.role !== Role.ADMIN && isDashboardEndpoint) {
        return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
    }

    return NextResponse.next();
}

