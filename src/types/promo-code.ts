export interface PromoCode {
    _id: string
    name: string
    description: string
    code: string
    priceType: string
    value: number
    cartValue: number
    redeemedCount: number
    quantity: number
    validFrom: string
    validTo: string
    maxDiscount: number
    createdAt: string
    updatedAt: string
    type: string
    __v: number
}