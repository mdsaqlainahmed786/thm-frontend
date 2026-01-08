import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import AppConfig from '@/config/constants';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        // Check for admin refresh token first
        const adminRefreshToken = cookieStore.get('AdminSessionToken')?.value;
        const userRefreshToken = cookieStore.get('SessionToken')?.value;

        // Handle admin refresh token
        if (adminRefreshToken) {
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
                    cookieStore.set('X-Admin-Access-Token', user.accessToken, {
                        secure: false,
                    });
                    if (user.refreshToken) {
                        cookieStore.set('AdminSessionToken', user.refreshToken, {
                            secure: false,
                        });
                    }
                }

                return NextResponse.json({ success: true });
            } catch (adminError: any) {
                const errorMessage = adminError.response?.data?.message || 'Failed to refresh admin token';
                return NextResponse.json(
                    { error: errorMessage },
                    { status: adminError.response?.status || 401 }
                );
            }
        }

        // Handle user/hotel refresh token
        if (userRefreshToken) {
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
                    cookieStore.set('X-Access-Token', user.accessToken, {
                        secure: false,
                    });
                    if (user.refreshToken) {
                        cookieStore.set('SessionToken', user.refreshToken, {
                            secure: false,
                        });
                    }
                }

                return NextResponse.json({ success: true });
            } catch (hotelError: any) {
                const errorMessage = hotelError.response?.data?.message || 'Failed to refresh token';
                return NextResponse.json(
                    { error: errorMessage },
                    { status: hotelError.response?.status || 401 }
                );
            }
        }

        // No refresh token found
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

