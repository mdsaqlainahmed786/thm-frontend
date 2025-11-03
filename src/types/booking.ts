import { PromoCode } from './promo-code';
import { BusinessProfileRef } from './subscription';
import { User } from "./user";
interface GeoCoordinate {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
}

interface UserAddress {
    _id: string;
    userID: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    geoCoordinate: GeoCoordinate;
    lat: number;
    lng: number;
}
export interface Booking {
    _id: string
    status: string
    adults: number
    children: number
    childrenAge: number[]
    bookedFor: string
    subTotal: number
    discount: number
    tax: number
    convinceCharge: number
    grandTotal: number
    checkIn: string
    checkOut: string
    guestDetails: any[]
    bookingID: string
    userID: string
    businessProfileID: string
    createdAt: string
    updatedAt: string
    bookedRoom: BookedRoom
    isTravellingWithPet: boolean
    razorPayOrderID: string
    promoCode: string
    promoCodeID: string
    roomsRef: RoomsRef
    usersRef: User & {
        userAddressesRef: UserAddress
    }
    businessProfileRef: BusinessProfileRef
    promoCodesRef: PromoCode
    freeCancelBy: string
    gstRate: number
    metadata: any
}
interface PaymentDetail {
    transactionID: string;
    paymentMethod: string;
    transactionAmount: number;
}
interface RoomsRef {
    _id: string;
    bedType: string;
    adults: number;
    children: number;
    maxOccupancy: number;
    availability: boolean;
    amenities: string[];
    roomType: string;
    businessProfileID: string;
    title: string;
    description: string;
    pricePerNight: number;
    currency: string;
    mealPlan: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    amenitiesRef?: AmenitiesRef[]
    roomImagesRef: RoomImagesRef[]
}
interface BookedRoom {
    roomID: string;
    price: number;
    quantity: number;
    nights: number;
}
interface GuestDetail {
    title: string;
    fullName: string;
    email: string;
    mobileNumber: string;
}


export interface AmenitiesRef {
    _id: string
    name: string
    category: string
}




export interface RoomImagesRef {
    _id: string
    isCoverImage: boolean
    sourceUrl: string
    thumbnailUrl: string
}



export interface HotelBooking {
    _id: string
    totalBookings: number
    confirmedBookings: number
    cancelledBookings: number
    pendingBookings: number
    businessProfileRef: BusinessProfileRef
}