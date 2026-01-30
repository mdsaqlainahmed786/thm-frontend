import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import AppConfig from '@/config/constants';

// Cookie options for Safari compatibility
// Access tokens need to be readable by JavaScript (for axios interceptors)
// Refresh tokens are read server-side only, but we keep them consistent
const getCookieOptions = () => ({
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
    sameSite: 'lax' as const, // Required for Safari compatibility
    path: '/', // Ensure cookies work across all routes
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds (604800)
    // Note: httpOnly is NOT set because access tokens need to be readable by JavaScript
});

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const url = request.nextUrl;
        const host = request.headers.get('host') || '';
        
        // Determine context from host and path
        const isHotelSubdomain = host.startsWith('hotels.');
        const isAdminSubdomain = host.startsWith('admin.');
        const isHotelRoute = url.pathname.startsWith('/hotels/');
        const isAdminRoute = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin/');
        
        console.log('[REFRESH-TOKEN] Refresh token request:', {
            host,
            pathname: url.pathname,
            isHotelSubdomain,
            isAdminSubdomain,
            isHotelRoute,
            isAdminRoute
        });
        
        // Check for admin refresh token first
        const adminRefreshToken = cookieStore.get('AdminSessionToken')?.value;
        const userRefreshToken = cookieStore.get('SessionToken')?.value;
        
        console.log('[REFRESH-TOKEN] Available tokens:', {
            hasAdminToken: !!adminRefreshToken,
            hasUserToken: !!userRefreshToken
        });

        // Handle admin refresh token - ONLY if we're in admin context
        if (adminRefreshToken && (isAdminSubdomain || isAdminRoute)) {
            console.log('[REFRESH-TOKEN] Refreshing admin token');
            try {
                const response = await axios({
                    url: `${AppConfig.API_ENDPOINT}/admin/auth/refresh-token`,
                    method: 'POST',
                    data: {
                        refreshToken: adminRefreshToken,
                    },
                    headers: {
                        'AdminSessionToken': adminRefreshToken,
                    },
                    withCredentials: true,
                });

                if (!response.data?.status && response.data?.statusCode !== 200) {
                    return NextResponse.json(
                        { error: response.data?.message || 'Failed to refresh admin token' },
                        { status: 401 }
                    );
                }

                const user = response.data?.data;
                if (user?.accessToken) {
                    const cookieOptions = getCookieOptions();
                    // Clear hotel cookies when refreshing admin token
                    cookieStore.delete('X-Access-Token');
                    cookieStore.delete('SessionToken');
                    cookieStore.set('X-Admin-Access-Token', user.accessToken, cookieOptions);
                    if (user.refreshToken) {
                        cookieStore.set('AdminSessionToken', user.refreshToken, cookieOptions);
                    }
                    console.log('[REFRESH-TOKEN] Admin tokens refreshed successfully');
                }

                return NextResponse.json({ success: true });
            } catch (adminError: any) {
                console.error('[REFRESH-TOKEN] Admin token refresh failed:', {
                    message: adminError.response?.data?.message,
                    status: adminError.response?.status
                });
                // Clear invalid admin tokens
                cookieStore.delete('X-Admin-Access-Token');
                cookieStore.delete('AdminSessionToken');
                const errorMessage = adminError.response?.data?.message || 'Failed to refresh admin token';
                return NextResponse.json(
                    { error: errorMessage },
                    { status: adminError.response?.status || 401 }
                );
            }
        } else if (adminRefreshToken && !isAdminSubdomain && !isAdminRoute) {
            // Admin token exists but we're in hotel context - clear it
            console.log('[REFRESH-TOKEN] Admin token found in hotel context, clearing it');
            cookieStore.delete('X-Admin-Access-Token');
            cookieStore.delete('AdminSessionToken');
        }

        // Handle user/hotel refresh token - ONLY if we're in hotel context
        if (userRefreshToken && (isHotelSubdomain || isHotelRoute)) {
            console.log('[REFRESH-TOKEN] Refreshing hotel token');
            try {
                const response = await axios({
                    url: `${AppConfig.API_ENDPOINT}/auth/refresh-token`,
                    method: 'POST',
                    data: {
                        refreshToken: userRefreshToken,
                    },
                    headers: {
                        'SessionToken': userRefreshToken,
                    },
                    withCredentials: true,
                });

                if (!response.data?.status && response.data?.statusCode !== 200) {
                    return NextResponse.json(
                        { error: response.data?.message || 'Failed to refresh token' },
                        { status: 401 }
                    );
                }

                const user = response.data?.data;
                if (user?.accessToken) {
                    const cookieOptions = getCookieOptions();
                    // Clear admin cookies when refreshing hotel token
                    cookieStore.delete('X-Admin-Access-Token');
                    cookieStore.delete('AdminSessionToken');
                    cookieStore.set('X-Access-Token', user.accessToken, cookieOptions);
                    if (user.refreshToken) {
                        cookieStore.set('SessionToken', user.refreshToken, cookieOptions);
                    }
                    console.log('[REFRESH-TOKEN] Hotel tokens refreshed successfully');
                }

                return NextResponse.json({ success: true });
            } catch (hotelError: any) {
                console.error('[REFRESH-TOKEN] Hotel token refresh failed:', {
                    message: hotelError.response?.data?.message,
                    status: hotelError.response?.status
                });
                // Clear invalid hotel tokens
                cookieStore.delete('X-Access-Token');
                cookieStore.delete('SessionToken');
                const errorMessage = hotelError.response?.data?.message || 'Failed to refresh token';
                return NextResponse.json(
                    { error: errorMessage },
                    { status: hotelError.response?.status || 401 }
                );
            }
        } else if (userRefreshToken && !isHotelSubdomain && !isHotelRoute) {
            // Hotel token exists but we're in admin context - clear it
            console.log('[REFRESH-TOKEN] Hotel token found in admin context, clearing it');
            cookieStore.delete('X-Access-Token');
            cookieStore.delete('SessionToken');
        }

        // No refresh token found for current context
        console.warn('[REFRESH-TOKEN] No valid refresh token found for current context');
        return NextResponse.json(
            { error: 'Refresh token not found' },
            { status: 401 }
        );
    } catch (error: any) {
        console.error('Refresh token error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh token';
        const statusCode = error.response?.status || 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

