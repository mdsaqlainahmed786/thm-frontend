import axios from 'axios';
import AppConfig from '../config/constants';
import { getCookie } from 'cookies-next';
import { signOut } from 'next-auth/react';
import { LOGIN_ROUTE, HOTEL_LOGIN_URL } from "@/types/auth";

const isDev = process.env.NODE_ENV === 'development';

const apiRequest = axios.create({
    baseURL: AppConfig.API_ENDPOINT,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout - prevents hanging connections
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
        
        if (accessToken) {
            config.headers[headerKey] = accessToken;
        }
        
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
        return Promise.reject(error);
    }
);

apiRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error.response exists before accessing its properties
        if (error.response) {
            // Skip logout for requests marked with skipAuthError flag
            if (originalRequest?.skipAuthError) {
                return Promise.reject(error);
            }
            
            // Don't logout for 403 (Forbidden) errors - these are permission issues, not auth issues
            if (error.response.status === 403) {
                return Promise.reject(error);
            }
            
            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await axios.post(`/api/auth/user-refresh-token`, {}, { timeout: 10000 });
                    // Retry the original request with the new token
                    return apiRequest(originalRequest);
                } catch (refreshError: any) {
                    // Check if we're on a hotel route
                    const isHotelRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/hotels/');
                    const redirectUrl = isHotelRoute ? HOTEL_LOGIN_URL : LOGIN_ROUTE;
                    signOut({ redirect: true, callbackUrl: redirectUrl });
                    return Promise.reject(refreshError);
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiRequest;
