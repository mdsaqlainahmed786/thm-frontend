import apiRequest from "./app-client";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { ReviewQuestion } from "@/types/review-questions";
const fetchBusinessTypes = async () => {
    try {
        const response = await apiRequest.get(`/business/types`, {
            params: {
                documentLimit: 20,
            }
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as {
                createdAt: string;
                icon: string;
                id: string;
                name: string;
                updatedAt: string;
            }[];
        } else {
            toast.error("Something went wrong");
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return [];
    }
}
const fetchBusinessSubtypes = async (businessTypeID: string) => {
    try {
        if (businessTypeID && businessTypeID !== "") {
            const response = await apiRequest.get(`/business/subtypes/${businessTypeID}`, {
                params: {
                    documentLimit: 20,
                }
            });
            if (response.status === 200 && response.data.status) {
                const responseData = response.data.data;
                return responseData as {
                    createdAt: string;
                    id: string;
                    name: string;
                    updatedAt: string;
                }[];
            } else {
                toast.error("Something went wrong");
                return [];
            }
        } else {
            return []
        }
    } catch (error) {
        handleClientApiErrors(error)
        return [];
    }
}

const fetchBusinessReviewQuestions = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/review-questions`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: ReviewQuestion[];
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

export { fetchBusinessTypes, fetchBusinessSubtypes, fetchBusinessReviewQuestions }
