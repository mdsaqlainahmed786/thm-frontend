import { BusinessTypeRef, BusinessSubtypeRef } from "./user"
export interface SubscriptionPlans {
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
    createdAt: string
    businessTypeRef?: BusinessTypeRef
    businessSubtypeRef?: BusinessSubtypeRef
    googleSubscriptionID: string
    appleSubscriptionID: string
}

