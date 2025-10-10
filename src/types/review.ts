
import { ReviewedBusinessProfileRef } from "./post";
import { ProfilePic } from "./user";
import { Review as ReviewType } from "./post";
import { Address } from "./user";
import { User } from "./user";
export interface Review {
    _id: string
    isPublished: boolean
    media: any[]
    reviews: ReviewType[]
    postID?: string
    userID?: string
    content: string
    businessName?: string
    address?: Address
    placeID: string
    rating: number
    createdAt: string
    updatedAt: string
    __v: number
    postedBy?: User
    email?: string
    name?: string
    reviewedBusinessProfileID?: string
    reviewedBusinessProfileRef?: ReviewedBusinessProfileRef
}
