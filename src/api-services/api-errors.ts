import toast from "react-hot-toast";

export const ERROR_MESSAGE = "Something went wrong";

/**
 * Handle API errors consistently across the application.
 * Note: 401 errors are handled by the axios interceptor in app-client.ts (with token refresh).
 * This function should NOT call signOut to avoid conflicts with the interceptor.
 */
export function handleClientApiErrors(error: any) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        
        // 401 errors are handled by axios interceptor (token refresh)
        // 403 errors are permission issues, not auth issues
        // Don't sign out here - let the interceptor handle auth
        if (error?.response?.status === 401) {
            // Already handled by interceptor, just show a message
            return;
        }
        
        if (error?.response?.status === 403) {
            toast.error("You don't have permission to perform this action");
            return;
        }
        
        // Show error message for other errors
        const message = error?.response?.data?.message || error?.response?.data || ERROR_MESSAGE;
        if (typeof message === 'string') {
            toast.error(message);
        } else {
            toast.error(ERROR_MESSAGE);
        }
    } else if (error.request) {
        // The request was made but no response was received
        toast.error("Network error - please check your connection");
    } else {
        // Something happened in setting up the request
        toast.error(error?.message ?? ERROR_MESSAGE);
    }
}
