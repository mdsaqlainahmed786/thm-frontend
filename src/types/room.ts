export interface Room {
    _id: string
    bedType: string
    adults: number
    children: number
    maxOccupancy: number
    availability: boolean
    amenities: string[] | Array<{ _id: string; name: string; category?: string }>
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
    roomImagesRef?: RoomImageRef[]
}

export interface RoomImageRef {
    _id: string
    isCoverImage: boolean
    sourceUrl: string
    thumbnailUrl: string
}
