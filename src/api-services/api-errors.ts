import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { LOGIN_ROUTE, HOTEL_LOGIN_URL } from "@/types/auth";
export const ERROR_MESSAGE = "Something went wrong";
export function handleClientApiErrors(error: any) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error?.response?.status === 403 || error?.response?.status == 401) {
            // Check if we're on a hotel route
            const isHotelRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/hotels/');
            const redirectUrl = isHotelRoute ? HOTEL_LOGIN_URL : LOGIN_ROUTE;
            signOut({ redirect: true, callbackUrl: redirectUrl });
            return;
        }
        console.log(error?.response?.data);
        console.log(error?.response?.status);
        console.log(error?.response?.headers);
        toast.error(error?.response?.data);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error?.request);
        toast.error("The request was made but no response was received");
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error?.message);
        toast.error(error?.message ?? "The request was made but error occurred");
    }

}