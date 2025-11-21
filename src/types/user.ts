export interface User {
  _id: string;
  bio: string;
  accountType: string;
  otp: number
  isVerified: boolean
  isApproved: boolean
  isActivated: boolean
  isDeleted: boolean
  hasProfilePicture: boolean
  acceptedTerms: boolean
  privateAccount: boolean
  notificationEnabled: boolean
  profilePic?: ProfilePic
  email: string;
  username: string;
  name: string;
  dialCode: string;
  phoneNumber: string;
  businessProfileID: string;
  createdAt: string;
  businessProfileRef: BusinessProfileRef
  businessDocumentsRef?: any[];
  role: string;
  followersCount?: number;
  followingCount?: number;
}

export interface UserProfile extends User {
  posts: number;
  follower: number;
  following: number;
  reportCount: number;
}

export interface BusinessTypeRef {
  _id: string;
  icon: string;
  name: string;
}

export interface BusinessSubtypeRef {
  _id: string;
  name: string;
}


export interface BusinessProfileRef {
  _id: string;
  bio: string;
  website: string;
  gstn: string;
  amenities: any[]
  privateAccount: boolean
  coverImage: string;
  rating: number
  profilePic: ProfilePic
  username: string;
  businessTypeID: string;
  businessSubTypeID: string;
  name: string;
  address: Address
  email: string;
  phoneNumber: string;
  dialCode: string;
  placeID: string;
  amenitiesRef: any[]
  businessAnswerRef: any[]
  businessTypeRef?: BusinessTypeRef;
  businessSubtypeRef?: BusinessSubtypeRef;
  languageSpoken?: SpokenLanguage[];
  checkIn: string;
  checkOut: string;
}

export interface SpokenLanguage {
  flag: string;
  name: string;
}

export interface ProfilePic {
  small: string;
  medium: string;
  large: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  geoCoordinate: GeoCoordinate
  lat: number
  lng: number
}

export interface GeoCoordinate {
  type: string;
  coordinates: number[]
}
