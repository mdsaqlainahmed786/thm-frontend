import { User, Address, ProfilePic, BusinessTypeRef, BusinessSubtypeRef } from "./user";
export interface Post {
    _id: string
    isPublished: boolean
    publicUserID?: string;
    googleReviewedBusiness?: string;
    media: string[]
    tagged: string[]
    feelings: string
    reviews: Review[]
    postType: string
    userID: string
    content?: string
    location?: Location
    placeID?: string
    rating?: number
    createdAt: string
    updatedAt: string
    __v: number
    mediaRef: MediaRef[]
    postedBy: User

    reportCount: number
    views?: number
    likes?: any[]
    likeCount?: number
    name?: string
    venue?: string
    streamingLink?: string
    startDate?: string
    startTime?: string
    endDate?: string
    endTime?: string
    type?: string
    businessProfileID?: string
    reviewedBusinessProfileID?: string
    reviewedBusinessProfileRef?: ReviewedBusinessProfileRef
}

export interface ReviewedBusinessProfileRef {
    _id: string;
    coverImage: string;
    profilePic: ProfilePic;
    username: string;
    name: string;
    accountType: string;
}
export interface Location {
    lat: number
    lng: number
    placeName: string
}
export interface Review {
    questionID: string
    rating: number
}
export interface MediaRef {
    _id: string
    businessProfileID?: string
    mediaType: string
    mimeType: string
    sourceUrl: string
    thumbnailUrl: string
    duration: number
}