import apiRequest from "./app-client";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { ERROR_MESSAGE } from "./api-errors";
const fetchFAQs = async (type: string, pageNumber: number) => {
    try {
        const response = await apiRequest.get(`/faqs`, {
            params: { type: type, pageNumber: pageNumber }
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: {
                    _id: string;
                    answer: string;
                    question: string;
                }[];
                message: string;
                pageNo: number;
                status: boolean;
                statusCode: number;
                totalPages: number;
                totalResources: number;
            }
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const contactUs = async (data: any) => {
    try {
        const response = await apiRequest.post(`/contact-us`, data);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

export { fetchFAQs, contactUs };