import { redirect } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
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
        '/hotels/financial/:path*',
        '/hotels/overview',
        '/hotels/room-management',
        '/hotels/support',
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
    console.log(isDashboardEndpoint ? "Yes " : "No ")
    console.log(pathname, "pathname");
    console.log(token?.role)
    console.log(token?.accountType)
    if (!token) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
    if (token && token.role === Role.ADMIN && !isDashboardEndpoint) {
        return NextResponse.redirect(new URL(DASHBOARD, req.url));
    }
    if (token && token.role !== Role.ADMIN && isDashboardEndpoint) {
        return NextResponse.redirect(new URL(HOTEL_DASHBOARD, req.url));
    }
    // if (token && token.accountType === "individual") {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }
    return NextResponse.next();
}

