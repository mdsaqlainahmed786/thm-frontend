import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import AppConfig from '@/config/constants';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('SessionToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token not found' },
                { status: 401 }
            );
        }

        // Try admin refresh token endpoint first
        let response;
        try {
            response = await axios({
                url: `${AppConfig.API_ENDPOINT}/admin/auth/refresh-token`,
                method: 'POST',
                data: {
                    refreshToken: refreshToken,
                },
                headers: {
                    'SessionToken': refreshToken,
                },
                withCredentials: true,
            });

            if (!response.data?.status && response.data?.statusCode !== 200) {
                throw new Error(response.data?.message || 'Admin refresh failed');
            }
        } catch (adminError: any) {
            // If admin endpoint fails, try hotel endpoint
            try {
                response = await axios({
                    url: `${AppConfig.API_ENDPOINT}/auth/refresh-token`,
                    method: 'POST',
                    data: {
                        refreshToken: refreshToken,
                    },
                    headers: {
                        'SessionToken': refreshToken,
                    },
                    withCredentials: true,
                });

                if (!response.data?.status && response.data?.statusCode !== 200) {
                    return NextResponse.json(
                        { error: response.data?.message || 'Failed to refresh token' },
                        { status: 401 }
                    );
                }
            } catch (hotelError: any) {
                const errorMessage = hotelError.response?.data?.message ||
                    adminError.response?.data?.message ||
                    'Failed to refresh token';
                return NextResponse.json(
                    { error: errorMessage },
                    { status: hotelError.response?.status || adminError.response?.status || 401 }
                );
            }
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

