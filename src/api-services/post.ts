import apiRequest from "./app-client";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { Post } from "@/types/post";
const fetchPost = async (userID: string) => {
    try {
        const response = await apiRequest.get(`/admin/users/${userID}`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as UserProfile;
        } else {
            toast.error("Something went wrong");
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const fetchPosts = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/posts`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: Post[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };
        } else {
            toast.error("Something went wrong");
            return null;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return null;
    }
}
export { fetchPost, fetchPosts }