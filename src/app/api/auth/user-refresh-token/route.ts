import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import AppConfig from '@/config/constants';

// Cookie options for Safari compatibility
const getCookieOptions = () => ({
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
});

// Axios instance with timeout for server-side requests
const serverAxios = axios.create({
    timeout: 15000, // 15 seconds timeout
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
        
        // Check for refresh tokens
        const adminRefreshToken = cookieStore.get('AdminSessionToken')?.value;
        const userRefreshToken = cookieStore.get('SessionToken')?.value;

        // Handle admin refresh token - ONLY if we're in admin context
        if (adminRefreshToken && (isAdminSubdomain || isAdminRoute)) {
            try {
                const response = await serverAxios({
                    url: `${AppConfig.API_ENDPOINT}/admin/auth/refresh-token`,
                    method: 'POST',
                    data: { refreshToken: adminRefreshToken },
                    headers: { 'AdminSessionToken': adminRefreshToken },
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
                    cookieStore.delete('X-Access-Token');
                    cookieStore.delete('SessionToken');
                    cookieStore.set('X-Admin-Access-Token', user.accessToken, cookieOptions);
                    if (user.refreshToken) {
                        cookieStore.set('AdminSessionToken', user.refreshToken, cookieOptions);
                    }
                }

                return NextResponse.json({ success: true });
            } catch (adminError: any) {
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
            cookieStore.delete('X-Admin-Access-Token');
            cookieStore.delete('AdminSessionToken');
        }

        // Handle user/hotel refresh token - ONLY if we're in hotel context
        if (userRefreshToken && (isHotelSubdomain || isHotelRoute)) {
            try {
                const response = await serverAxios({
                    url: `${AppConfig.API_ENDPOINT}/auth/refresh-token`,
                    method: 'POST',
                    data: { refreshToken: userRefreshToken },
                    headers: { 'SessionToken': userRefreshToken },
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
                    cookieStore.delete('X-Admin-Access-Token');
                    cookieStore.delete('AdminSessionToken');
                    cookieStore.set('X-Access-Token', user.accessToken, cookieOptions);
                    if (user.refreshToken) {
                        cookieStore.set('SessionToken', user.refreshToken, cookieOptions);
                    }
                }

                return NextResponse.json({ success: true });
            } catch (hotelError: any) {
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
            cookieStore.delete('X-Access-Token');
            cookieStore.delete('SessionToken');
        }

        // No refresh token found for current context
        return NextResponse.json(
            { error: 'Refresh token not found' },
            { status: 401 }
        );
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh token';
        const statusCode = error.response?.status || 500;
        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}
