import { BusinessTypeRef, BusinessSubtypeRef } from './user';
export interface Subscription {
    _id: string
    isCancelled: boolean
    userID: string
    subscriptionPlanID: string
    orderID: string
    expirationDate: string
    createdAt: string
    subscriptionPlansRef: SubscriptionPlansRef
    ordersRef: OrdersRef
    usersRef: UsersRef
    businessProfileID?: string

}
export interface SubscriptionPlansRef {
    _id: string
    features: string[]
    businessSubtypeID: string[]
    businessTypeID: string[]
    name: string
    description: string
    price: number
    duration: string
    image: string
    type: string
    level: string
    currency: string
}
export interface OrdersRef {
    _id: string
    subTotal: number
    discount: number
    tax: number
    grandTotal: number
    orderID: string
    userID: string
    billingAddress: BillingAddress
    subscriptionPlanID: string
    status: string
    razorPayOrderID: string
    paymentDetail: PaymentDetail
}

export interface BillingAddress {
    address: Address
    name: string
    phoneNumber: string
    dialCode: string
    gstn: string
}

export interface Address {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    geoCoordinate: GeoCoordinate
    lat: number
    lng: number
}

export interface GeoCoordinate {
    type: string
    coordinates: number[]
}

export interface PaymentDetail {
    transactionID: string
    paymentMethod: string
    transactionAmount: number
}

export interface UsersRef {
    _id: string
    accountType: string
    profilePic?: ProfilePic
    username: string
    name: string
    businessProfileRef?: BusinessProfileRef
}

export interface ProfilePic {
    small: string
    medium: string
    large: string
}

export interface BusinessProfileRef {
    _id: string
    profilePic: ProfilePic
    username: string
    name: string
    rating: number
    address: Address
    businessTypeRef: BusinessTypeRef
    businessSubtypeRef: BusinessSubtypeRef
    userID: string
}


