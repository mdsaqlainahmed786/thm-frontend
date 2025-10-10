export interface Room {
    _id: string
    bedType: string
    adults: number
    children: number
    maxOccupancy: number
    availability: boolean
    amenities: string[]
    roomType: string
    businessProfileID: string
    title: string
    description: string
    pricePerNight: number
    currency: string
    mealPlan: string
    createdAt: string
    updatedAt: string
    totalRooms: number
}
