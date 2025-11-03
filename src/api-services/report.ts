import apiRequest from "./app-client";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { SubscriptionPlans } from "@/types/subscription-plans";
import { Post } from "@/types/post";
import { User, UserProfile } from "@/types/user";
interface Comment {
    _id: string,
    postType?: string,
    postID: string,
    message: string,
    userID: string,
}
const fetchReports = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/reports`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: {
                    _id: string
                    reason: string
                    contentType: string
                    reportedBy: string
                    contentID: string
                    createdAt: string
                    updatedAt: string
                    postsRef?: Post
                    commentsRef?: Comment
                    reportedByRef: UserProfile
                    usersRef?: UserProfile
                }[];
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
const fetchTopReports = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/top-reports`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as {
                reports:
                {
                    totalReports: number,
                    labelName: string
                }[],
                documents: {
                    _id: string
                    contentType: string
                    usersRef?: User
                    postsRef?: Post
                    commentsRef?: Comment
                    createdAt: string
                    totalReports: number
                }[]
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

export { fetchReports, fetchTopReports }
