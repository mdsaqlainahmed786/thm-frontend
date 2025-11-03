
import { BusinessTypeRef, BusinessSubtypeRef } from "./user";
export interface ReviewQuestion {
    _id: string
    businessSubtypeID: string[]
    businessTypeID: string[]
    question: string
    order: number
    createdAt: string
    businessTypeRef: BusinessTypeRef
    businessSubtypeRef: BusinessSubtypeRef
}
