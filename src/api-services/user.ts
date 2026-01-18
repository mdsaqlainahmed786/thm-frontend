import apiRequest from "./app-client";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { User } from "@/types/user";
import moment from "moment";
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
 * Fetch all users (root-admin only endpoint)
 * Optional query params: query, accountType, role, sortOrder (asc|desc)
 */
const fetchAllUsers = async (params?: { query?: string; accountType?: string; role?: string; sortOrder?: "asc" | "desc" }) => {
    try {
        const paramsKey = Object.keys(params || {});
        const apiParams: { [key: string]: any } = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params && params[key as keyof typeof params] && params[key as keyof typeof params] !== '') {
                Object.assign(apiParams, { [key]: params[key as keyof typeof params] })
            }
        })
        const response = await apiRequest.get(`/admin/users/fetch-users`, {
            params: apiParams
        });
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

export { fetchUser, fetchUsers, fetchUserGrowth, addAdmin, fetchAllUsers }