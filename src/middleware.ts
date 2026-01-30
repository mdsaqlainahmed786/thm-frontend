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
    
    // CRITICAL: Clear admin cookies if we're on hotel subdomain/route to prevent cross-contamination
    // Only clear if there's a mismatch (admin cookies exist but we're in hotel context)
    if ((isHotelSubdomain || isHotelRoute) && pathname !== HOTEL_LOGIN_ROUTE) {
        const adminSessionToken = cookieStore.get('AdminSessionToken');
        const adminAccessToken = cookieStore.get('X-Admin-Access-Token');
        const hotelSessionToken = cookieStore.get('SessionToken');
        
        // Only clear admin cookies if they exist AND we have a valid hotel session
        // This prevents clearing during login flow but cleans up after context switch
        if ((adminSessionToken || adminAccessToken) && hotelSessionToken) {
            console.log('[MIDDLEWARE] Clearing admin cookies on hotel subdomain - context mismatch detected');
            const response = NextResponse.next();
            response.cookies.delete('AdminSessionToken');
            response.cookies.delete('X-Admin-Access-Token');
            return response;
        }
    }
    
    // CRITICAL: Clear hotel cookies if we're on admin subdomain to prevent cross-contamination
    // Only clear if there's a mismatch (hotel cookies exist but we're in admin context)
    if (isAdminSubdomain && pathname !== LOGIN_ROUTE) {
        const hotelSessionToken = cookieStore.get('SessionToken');
        const hotelAccessToken = cookieStore.get('X-Access-Token');
        const adminSessionToken = cookieStore.get('AdminSessionToken');
        
        // Only clear hotel cookies if they exist AND we have a valid admin session
        if ((hotelSessionToken || hotelAccessToken) && adminSessionToken) {
            console.log('[MIDDLEWARE] Clearing hotel cookies on admin subdomain - context mismatch detected');
            const response = NextResponse.next();
            response.cookies.delete('SessionToken');
            response.cookies.delete('X-Access-Token');
            return response;
        }
    }

    // Read NextAuth token once (used for both admin + hotel auth).
    // This lets us authorize hotel routes even when refresh tokens are httpOnly on API domain
    // (or not returned at all) as long as NextAuth session is valid.
    // IMPORTANT: getToken() must use the same secret as NextAuth, otherwise it always returns null.
    const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || "rCpp0FxsnpdW76Nyb7BUdddd",
    });

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
            host,
            hasNextAuthToken: !!nextAuthToken
        });
        if (userSessionToken || nextAuthToken) {
            // Hotel/user is logged in, redirect to hotel dashboard
            console.log('[MIDDLEWARE] Auth found (SessionToken or NextAuth), redirecting to dashboard');
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
            host,
            hasNextAuthToken: !!nextAuthToken,
            nextAuthAccountType: (nextAuthToken as any)?.accountType,
        });
        // Allow access if either our legacy SessionToken exists OR NextAuth session exists for business accounts.
        const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
        if (!hotelSessionToken && !hasValidNextAuthForHotel) {
            // No SessionToken cookie, redirect to hotel login
            console.log('[MIDDLEWARE] No SessionToken found, redirecting to login');
            return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, req.url));
        }
        // SessionToken exists, allow access to hotel routes
        console.log('[MIDDLEWARE] Auth found (SessionToken or NextAuth), allowing access to hotel route');
        return NextResponse.next();
    }

    // 4. Admin Route Authentication - Use NextAuth token for admin routes
    const isDashboardEndpoint = dashboardEndpoints.some((endpoint) => {
        const regex = new RegExp(`^${endpoint.replace(/:path\*/g, '.*')}$`);
        return regex.test(pathname);
    });

    // Only check NextAuth token for admin routes
    const token = nextAuthToken;

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
