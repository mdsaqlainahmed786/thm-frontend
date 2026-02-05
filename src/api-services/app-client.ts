import axios from 'axios';
import AppConfig from '../config/constants';
import { getCookie } from 'cookies-next';
import { signOut } from 'next-auth/react';
import { LOGIN_ROUTE, HOTEL_LOGIN_URL } from "@/types/auth";
const apiRequest = axios.create({
    baseURL: AppConfig.API_ENDPOINT,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
});
/**
 * Request interceptor
 */
apiRequest.interceptors.request.use(
    async (config) => {
        const url = config.url ?? '';
        // Prefer API-path based detection (robust even when admin UI route is /users, /posts, etc.)
        const isAdminApiRequest =
            url.startsWith('/admin/') ||
            url.includes('/api/v1/admin/') ||
            url.includes('/admin/');

        // Fallback: determine if this is an admin request based on current UI route
        const isAdminUiRoute =
            typeof window !== 'undefined' &&
            (window.location.pathname.startsWith('/dashboard') ||
                window.location.pathname.startsWith('/admin/'));

        const isAdminRequest = isAdminApiRequest || isAdminUiRoute;
        
        // Use appropriate token based on context
        let accessToken;
        let headerKey;
        
        if (isAdminRequest) {
            accessToken = getCookie('X-Admin-Access-Token');
            headerKey = 'X-Admin-Access-Token';
        } else {
            accessToken = getCookie('X-Access-Token');
            headerKey = 'X-Access-Token';
        }
        
        console.log('[API-REQUEST] Request interceptor:', {
            url: config.url,
            method: config.method,
            isAdminRequest,
            hasAccessToken: !!accessToken,
            headerKey,
            pathname: typeof window !== 'undefined' ? window.location.pathname : 'server'
        });
        
        if (accessToken) {
            config.headers[headerKey] = accessToken;
        } else {
            console.warn('[API-REQUEST] No access token found for request:', config.url);
        }
        // Ensure headers are set for CORS
        // Only set Content-Type for JSON requests.
        // Let the browser set the boundary for FormData (file uploads).
        if (config.data && !config.headers['Content-Type']) {
            const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
            if (!isFormData) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        // Always set Accept header
        if (!config.headers['Accept']) {
            config.headers['Accept'] = 'application/json';
        }
        config.withCredentials = true;
        return config;
    },
    (error) => {
        console.error('[API-REQUEST] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

apiRequest.interceptors.response.use(
    (response) => {
        console.log('[API-RESPONSE] Response received:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText
        });
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error.response exists before accessing its properties
        if (error.response) {
            console.log('[API-RESPONSE] Error response:', {
                url: originalRequest?.url,
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                hasData: !!error.response.data,
                dataType: typeof error.response.data
            });
            
            // Skip logout for requests marked with skipAuthError flag (e.g., QR code endpoints)
            if (originalRequest.skipAuthError) {
                console.log('[API-RESPONSE] Skipping auth error handling (skipAuthError flag set)');
                return Promise.reject(error);
            }
            
            // Don't logout for 403 (Forbidden) errors - these are permission issues, not auth issues
            if (error.response.status === 403) {
                console.log('[API-RESPONSE] 403 Forbidden error, not logging out');
                return Promise.reject(error);
            }
            
            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if (error.response.status === 401 && !originalRequest._retry) {
                console.log('[API-RESPONSE] 401 Unauthorized, attempting token refresh');
                originalRequest._retry = true;
                try {
                    console.log('[API-RESPONSE] Calling refresh token endpoint');
                    await axios.post(`/api/auth/user-refresh-token`, {});
                    console.log('[API-RESPONSE] Token refresh successful, retrying original request');
                    // Retry the original request with the new token
                    return apiRequest(originalRequest);
                } catch (refreshError: any) {
                    // Handle refresh token error or redirect to login
                    console.error('[API-RESPONSE] Token refresh failed:', {
                        message: refreshError?.message,
                        response: refreshError?.response?.status,
                        responseData: refreshError?.response?.data,
                        stack: refreshError?.stack
                    });
                    // Check if we're on a hotel route
                    const isHotelRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/hotels/');
                    const redirectUrl = isHotelRoute ? HOTEL_LOGIN_URL : LOGIN_ROUTE;
                    console.log('[API-RESPONSE] Signing out and redirecting to:', redirectUrl);
                    signOut({ redirect: true, callbackUrl: redirectUrl });
                    return Promise.reject(refreshError);
                }
            }
        } else {
            console.error('[API-RESPONSE] Error without response object:', {
                message: error?.message,
                code: error?.code,
                config: error?.config?.url,
                hasRequest: !!error?.request
            });
        }
        return Promise.reject(error);
    }
);
export default apiRequest;

