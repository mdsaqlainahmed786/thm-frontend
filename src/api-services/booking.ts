import apiRequest from "./app-client";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { Booking, HotelBooking } from "@/types/booking";
import { Role } from "@/types/auth";
import { Room } from "@/types/room";
import { ERROR_MESSAGE } from "./api-errors";
const fetchBookings = async (params: { [key: string]: any }, role?: Role) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        if (role) {
            Object.assign(apiParams, { role })
        }
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/bookings`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: Booking[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            // React Query v5 queryFns must not return undefined
            return {
                data: [],
                pageNo: Number(params?.pageNumber ?? 1),
                totalPages: 0,
                totalResources: 0,
            };
        }
    } catch (error) {
        handleClientApiErrors(error)
        // React Query v5 queryFns must not return undefined
        return {
            data: [],
            pageNo: Number(params?.pageNumber ?? 1),
            totalPages: 0,
            totalResources: 0,
        };
    }
}
const fetchBooking = async (bookingID: string) => {
    try {
        const response = await apiRequest.get(`/bookings/${bookingID}`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as Booking;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const changeBookingStatus = async (bookingID: string, status: string) => {
    try {
        const response = await apiRequest.patch(`bookings/${bookingID}/change-status`, { status });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as Booking;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const hotelBookingsStatistical = async () => {
    try {
        const response = await apiRequest.get(`/admin/bookings/hotels`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: HotelBooking[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };;
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const fetchRooms = async (params: { [key: string]: any }, role?: Role) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        if (role) {
            Object.assign(apiParams, { role })
        }
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/rooms`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: Room[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}


const fetchPricePreset = async (params: { [key: string]: any }, role?: Role) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        if (role) {
            Object.assign(apiParams, { role })
        }
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/price-preset`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: {
                    _id: string;
                    months: number[];
                    weeks: number[];
                    businessProfileID: string;
                    type: string;
                    price: number;
                    weekendPrice: number;
                    createdAt: string;
                    startDate: string;
                    endDate: string;
                    isActive: boolean;
                }[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };
        } else {
            toast.error(response?.data?.message ?? ERROR_MESSAGE);
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}

const createPricePreset = async (data: { [key: string]: any }) => {
    try {
        const response = await apiRequest.post(`/price-preset`, data);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
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

const deletePricePreset = async (ID: string) => {
    try {
        const response = await apiRequest.delete(`/price-preset/${ID}`);
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

const updatePricePreset = async (data: any, ID: string) => {
    try {
        const response = await apiRequest.put(`/price-preset/${ID}`, data);
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



export { fetchBookings, fetchBooking, hotelBookingsStatistical, fetchRooms, fetchPricePreset, createPricePreset, deletePricePreset, updatePricePreset, changeBookingStatus }