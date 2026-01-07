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
        //FIXME Change to bearer token
        const accessToken = getCookie('X-Access-Token');
        if (accessToken) {
            // console.log(accessToken);
            config.headers['X-Access-Token'] = accessToken;
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
        // console.log(accessToken);
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

apiRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error.response exists before accessing its properties
        if (error.response) {
            console.log("If the error status", error.response.status, error.response.data);
            
            // Skip logout for requests marked with skipAuthError flag (e.g., QR code endpoints)
            if (originalRequest.skipAuthError) {
                return Promise.reject(error);
            }
            
            // Don't logout for 403 (Forbidden) errors - these are permission issues, not auth issues
            if (error.response.status === 403) {
                return Promise.reject(error);
            }
            
            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await axios.post(`/api/auth/user-refresh-token`, {});
                    //Store access token
                    // Retry the original request with the new token
                    console.log('Retry The original request');
                    return apiRequest(originalRequest);
                } catch (refreshError) {
                    // Handle refresh token error or redirect to login
                    console.log("Handle refresh token error or redirect to login", refreshError)
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

