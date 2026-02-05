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

    // Build redirects using the public origin as seen by the browser (NOT the upstream origin).
    // If nginx doesn't forward Host/proto correctly, `req.url` can look like http://127.0.0.1:3000
    // which would leak into Location headers and cause users to be redirected to localhost.
    const forwardedProto = (req.headers.get('x-forwarded-proto') || '')
        .split(',')[0]
        .trim()
        .toLowerCase();
    const isDevHost = host.includes('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0');
    const publicProto = forwardedProto || (isDevHost ? 'http' : 'https');
    const publicOrigin = `${publicProto}://${host}`;

    // Determine current subdomain status
    const isHotelSubdomain = host.startsWith('hotels.');
    const isAdminSubdomain = host.startsWith('admin.');
    const isApexDomain = !isHotelSubdomain && !isAdminSubdomain;

    const isHotelRoute = pathname.startsWith('/hotels/');

    // IMPORTANT: On apex domain, hotel routes must be served from the hotels subdomain.
    // If we allow client-side navigation on apex (RSC fetch to /hotels/*), middleware redirects will trigger
    // CORS/preflight failures ("Redirect is not allowed for a preflight request") and can cause UI flicker.
    // So we always perform a document redirect to the hotels subdomain early.
    if (isApexDomain && !isDevHost && isHotelRoute) {
        const target = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, 'https://hotels.thehotelmedia.com');
        return NextResponse.redirect(target);
    }
    
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
            return NextResponse.redirect(new URL(DASHBOARD, publicOrigin));
        }
        // No admin session, allow access to admin login page
        return NextResponse.next();
    }

    if (pathname === HOTEL_LOGIN_ROUTE) {
        const userSessionToken = cookieStore.get('SessionToken');
        const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
        console.log('[MIDDLEWARE] Hotel login route check:', {
            pathname,
            hasSessionToken: !!userSessionToken,
            sessionTokenValue: userSessionToken?.value ? 'exists' : 'missing',
            host,
            hasNextAuthToken: !!nextAuthToken,
            hasValidNextAuthForHotel
        });
        if (userSessionToken || hasValidNextAuthForHotel) {
            // Hotel/user is logged in, redirect to hotel dashboard
            console.log('[MIDDLEWARE] Auth found (SessionToken or valid NextAuth business), redirecting to dashboard');
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, publicOrigin));
        }
        // No hotel session, allow access to hotel login page
        console.log('[MIDDLEWARE] No SessionToken, allowing access to login page');
        return NextResponse.next();
    }

    // 1. Apex Domain Handling (non-hotel routes)
    // Allow root (/) and other non-hotel paths to load the landing page
    if (isApexDomain && !isDevHost && pathname === '/') {
        return NextResponse.next();
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
            return NextResponse.redirect(new URL(HOTEL_LOGIN_ROUTE, publicOrigin));
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
            const hasValidNextAuthForHotel = !!nextAuthToken && (nextAuthToken as any)?.accountType === 'business';
            console.log('[MIDDLEWARE] Root path on hotel subdomain:', {
                hasSessionToken: !!hotelSessionToken,
                hasValidNextAuthForHotel,
                redirectingTo: (hotelSessionToken || hasValidNextAuthForHotel) ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE
            });
            return NextResponse.redirect(new URL((hotelSessionToken || hasValidNextAuthForHotel) ? HOTEL_DASHBOARD : HOTEL_LOGIN_ROUTE, publicOrigin));
        }
        if (isAdminSubdomain) {
            console.log('[MIDDLEWARE] Root path on admin subdomain:', {
                hasToken: !!token,
                redirectingTo: token ? DASHBOARD : LOGIN_ROUTE
            });
            return NextResponse.redirect(new URL(token ? DASHBOARD : LOGIN_ROUTE, publicOrigin));
        }
    }

    // 6. Admin Authentication & Role-based access
    if (token) {
        // Redirection for authenticated admin users hitting root
        if (pathname === "/" && !isApexDomain && isAdminSubdomain) {
            return NextResponse.redirect(new URL(DASHBOARD, publicOrigin));
        }

        // Protect admin dashboard routes - only allow admin role
        if (isDashboardEndpoint && token.role !== Role.ADMIN) {
            return NextResponse.redirect(new URL(HOTEL_DASHBOARD, publicOrigin));
        }
    } else {
        // 7. Unauthenticated protection for admin routes

        // On admin subdomain, protect dashboard routes
        if (isAdminSubdomain && isDashboardEndpoint) {
            return NextResponse.redirect(new URL(LOGIN_ROUTE, publicOrigin));
        }

        // Protect admin dashboard routes regardless of subdomain
        if (isDashboardEndpoint && !isHotelRoute) {
            return NextResponse.redirect(new URL(LOGIN_ROUTE, publicOrigin));
        }
    }

    return NextResponse.next();
}
