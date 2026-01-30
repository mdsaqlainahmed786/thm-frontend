import apiRequest from "./app-client";
import toast from "react-hot-toast";
import { ERROR_MESSAGE, handleClientApiErrors } from "./api-errors";
import { User, UserProfile } from "@/types/user";
import { Amenity } from "@/types/amenity";
import { UsersRef } from "@/types/subscription";
import { Room } from "@/types/room";
const fetchHotelDashboard = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/hotels/dashboard`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as {
                newBookings: number;
                todayCheckIn: number;
                todayCheckOut: number;
                earnings: number;
                totalRooms: number;
                availableRooms: number;
            };;
        } else {
            toast.error("Something went wrong");
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchProfile = async () => {
    try {
        const response = await apiRequest.get(`/user/profile`);
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

const updateProfile = async (data: any) => {
    try {
        const response = await apiRequest.patch(`/user/edit-profile`, data);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            toast.success("Profile update successfully");
            return responseData;
        } else {
            toast.error("Something went wrong");
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchLanguages = async () => {
    try {
        // const response = await apiRequest.get(`/languages`);
        // if (response.status === 200 && response.data.status) {
        //     const responseData = response.data.data as {
        //         countries: string[];
        //         languageCode: string;
        //         languageName: string;
        //     }[];
        return []
        // } else {
        //     return [];
        // }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchBusinessQuestions = async (businessTypeID: string, businessSubtypeID: string) => {
    try {
        const response = await apiRequest.post(`/business/questions`, {
            businessTypeID,
            businessSubtypeID
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data as {
                answer: string[];
                question: string;
                id: string;
                _id: string;
            }[];
            return responseData;
        } else {
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const updateAmenity = async (data: any) => {
    try {
        const response = await apiRequest.post(`/business/questions/answers`, data);
        if (response.status === 200 && response.data.status) {
            toast.success("Amenity updated successfully");
            return response.data.data;
        } else {
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchAmenities = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/amenities`, {
            params: apiParams
        });

        if (response.status === 200 && response.data.status) {

            const responseData = response.data.data as Amenity[];
            return responseData;
        } else {
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const createRoom = async (data: any) => {
    try {
        const response = await apiRequest.post(`/rooms`, data);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const deleteRoom = async (ID: string) => {
    try {
        const response = await apiRequest.delete(`/rooms/${ID}`);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const updateRoom = async (data: any, ID: string) => {
    try {
        const response = await apiRequest.put(`/rooms/${ID}`, data);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const deleteRoomImage = async (roomID: string, imageID: string) => {
    try {
        // Try common endpoint patterns for deleting room images
        const response = await apiRequest.delete(`/rooms/${roomID}/images/${imageID}`);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message || "Image deleted successfully");
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        // If the specific endpoint doesn't exist, try alternative pattern
        try {
            const response = await apiRequest.delete(`/room-images/${imageID}`);
            if (response.status === 200 && response.data.status) {
                toast.success(response.data.message || "Image deleted successfully");
                return response.data;
            } else {
                toast.error(response?.data?.message ?? ERROR_MESSAGE);
                return response.data;
            }
        } catch (error2) {
            handleClientApiErrors(error2);
            return undefined;
        }
    }
}

const fetchRoom = async (ID: string) => {
    try {
        const response = await apiRequest.get(`/rooms/${ID}`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as Room;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchBanks = async () => {
    try {
        const response = await apiRequest.get(`/banks`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data as {
                name: string;
                ifsc: string;
                icon: string;
                website: string;
            }[];
            return responseData;
        } else {
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchAccounts = async () => {
    try {
        const response = await apiRequest.get(`/banks/accounts`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data as {
                _id: string;
                type: string;
                isVerified: boolean;
                documents: any[];
                businessProfileID: string;
                userID: string;
                bankName: string;
                bankIcon: string;
                accountNumber: string;
                ifsc: string;
                accountHolder: string;
                createdAt: string;
                primaryAccount: boolean;
            }[];
            return responseData;
        } else {
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const deleteAccount = async (ID: string) => {
    try {
        const response = await apiRequest.delete(`/banks/accounts/${ID}`);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const setPrimaryAccount = async (ID: string) => {
    try {
        const response = await apiRequest.patch(`/banks/accounts/${ID}`);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const createBankAccount = async (data: any) => {
    try {
        const response = await apiRequest.post(`/banks/accounts`, data);
        if (response.status === 200 && response.data.status) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return response.data;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchBusinessNotifications = async () => {
    try {
        const [notifications, notificationsMeta] = await Promise.all([
            apiRequest.get(`/notifications`),
            apiRequest.get(`/notifications/status`),
        ]);

        if (notifications.status === 200 && notifications.data.status && notificationsMeta.status === 200 && notificationsMeta.data.status) {
            const hasUnreadMessages = notificationsMeta?.data?.data?.notifications?.hasUnreadMessages;
            console.log('[NOTIFICATIONS] Fetch successful:', {
                notificationsCount: notifications?.data?.data?.length ?? 0,
                hasUnreadMessages: hasUnreadMessages,
                notificationsMetaData: notificationsMeta?.data?.data,
                notificationsObject: notificationsMeta?.data?.data?.notifications
            });
            const data = {
                notifications: notifications?.data?.data ?? [],
                notificationsCount: notificationsMeta?.data?.data?.notifications?.count ?? 0,
                hasUnreadNotifications: notificationsMeta?.data?.data?.notifications?.hasUnreadMessages ?? false,
            } as {
                notifications: {
                    _id: string
                    userID: string
                    title: string
                    description: string
                    type: string
                    metadata: any
                    isSeen: boolean
                    createdAt: string
                    usersRef: UsersRef
                    isConnected: boolean
                    isRequested: boolean
                }[],
                notificationsCount: number;
                hasUnreadNotifications: boolean;
            }
            return data;
        } else {
            if (notifications?.data) {
                toast.error(notifications?.data?.message ?? ERROR_MESSAGE);
            }
            if (notificationsMeta?.data) {
                toast.error(notificationsMeta?.data?.message ?? ERROR_MESSAGE);

            }
            return {
                notifications: [],
                notificationsCount: 0,
                hasUnreadNotifications: false,
            };
        }
    } catch (error) {
        handleClientApiErrors(error)
        return {
            notifications: [],
            notificationsCount: 0,
            hasUnreadNotifications: false,
        };
    }
}

export { fetchHotelDashboard, fetchProfile, updateProfile, fetchLanguages, fetchBusinessQuestions, updateAmenity, fetchAmenities, createRoom, deleteRoom, updateRoom, deleteRoomImage, fetchRoom, fetchBanks, fetchAccounts, setPrimaryAccount, createBankAccount, fetchBusinessNotifications, deleteAccount }