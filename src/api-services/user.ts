import apiRequest from "./app-client";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { User } from "@/types/user";
import moment from "moment";
import type { NthSignupUser } from "@/types/user";
const fetchUser = async (userID: string) => {
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
const fetchUsers = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/users`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: User[];
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

interface UserGrowthData {
    date: string;
    count: number;
}

const fetchUserGrowth = async (params: { viewMode: "daily" | "monthly"; accountType?: string }) => {
    try {
        // Calculate date range based on view mode
        const endDate = moment();
        const startDate = params.viewMode === "daily"
            ? moment().subtract(30, "days") // Last 30 days for daily view
            : moment().subtract(12, "months"); // Last 12 months for monthly view

        const apiParams: { [key: string]: any } = {
            documentLimit: 10000, // Fetch a large number to get all users for statistics
            pageNumber: 1,
        };

        if (params.accountType) {
            apiParams.accountType = params.accountType;
        }

        const response = await apiRequest.get(`/admin/users`, {
            params: apiParams
        });

        if (response.status === 200 && response.data.status) {
            const users = response.data.data as User[];

            // Filter users within date range and group by date
            const growthMap = new Map<string, number>();

            users.forEach((user) => {
                if (user.createdAt) {
                    const userDate = moment(user.createdAt);
                    if (userDate.isSameOrAfter(startDate) && userDate.isSameOrBefore(endDate)) {
                        let dateKey: string;
                        if (params.viewMode === "daily") {
                            dateKey = userDate.format("YYYY-MM-DD");
                        } else {
                            dateKey = userDate.format("YYYY-MM");
                        }

                        const currentCount = growthMap.get(dateKey) || 0;
                        growthMap.set(dateKey, currentCount + 1);
                    }
                }
            });

            // Fill in all dates in range with 0 counts for missing dates
            const filledData: UserGrowthData[] = [];
            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate)) {
                const dateKey = params.viewMode === "daily"
                    ? currentDate.format("YYYY-MM-DD")
                    : currentDate.format("YYYY-MM");

                const existingData = growthMap.get(dateKey);
                filledData.push({
                    date: dateKey,
                    count: existingData || 0,
                });

                if (params.viewMode === "daily") {
                    currentDate.add(1, "day");
                } else {
                    currentDate.add(1, "month");
                }
            }

            return filledData;
        } else {
            toast.error("Something went wrong");
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error);
        return [];
    }
};

const addAdmin = async (username: string, adminPassword: string) => {
    try {
        const response = await apiRequest.post(`/admin/users/add-admin`, {
            username,
            adminPassword
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            toast.success("Admin added successfully");
            return responseData as User;
        } else {
            toast.error("Something went wrong");
            return null;
        }
    } catch (error) {
        handleClientApiErrors(error);
        return null;
    }
};

/**
 * Fetch all administrators (root-admin only endpoint)
 * No query params; always returns users with role administrator
 */
const fetchAllUsers = async () => {
    try {
        const response = await apiRequest.get(`/admin/users/fetch-users`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData.data as User[];
        } else {
            toast.error("Something went wrong");
            return null;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return null;
    }
}

/**
 * Demote administrator to user (root-admin only endpoint)
 */
const demoteAdmin = async (userID: string) => {
    try {
        const response = await apiRequest.put(`/admin/users/${userID}/demote-admin`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            toast.success("Administrator demoted successfully");
            return responseData as User;
        } else {
            toast.error("Something went wrong");
            return null;
        }
    } catch (error) {
        handleClientApiErrors(error);
        return null;
    }
};

type NthSignupResponse = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        n: number;
        user: NthSignupUser;
    };
};

const fetchNthSignupUser = async (n: number, includeAdmins?: boolean) => {
    try {
        const response = await apiRequest.get(`/admin/users/nth-signup/${n}`, {
            params: includeAdmins ? { includeAdmins: true } : undefined,
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data as NthSignupResponse;
            return responseData.data;
        } else {
            toast.error(response?.data?.message ?? "Something went wrong");
            return null;
        }
    } catch (error: any) {
        const status = error?.response?.status;
        // For these, show inline UI message instead of global error handling/toasts
        if (status === 400 || status === 404) {
            const message =
                error?.response?.data?.message ??
                error?.response?.data?.data?.message ??
                "Request failed";
            const err = new Error(message);
            (err as any).status = status;
            throw err;
        }
        handleClientApiErrors(error);
        throw error;
    }
};

export { fetchUser, fetchUsers, fetchUserGrowth, addAdmin, fetchAllUsers, demoteAdmin, fetchNthSignupUser }