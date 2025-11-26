import axios from 'axios';
import AppConfig from '../config/constants';
import { getCookie } from 'cookies-next';
import { signOut } from 'next-auth/react';
import { LOGIN_ROUTE } from "@/types/auth";
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
        // Only set Content-Type for requests with a body (POST, PUT, PATCH)
        if (config.data && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
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
                    // signOut({ redirect: true, callbackUrl: LOGIN_ROUTE });
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
export default apiRequest;

