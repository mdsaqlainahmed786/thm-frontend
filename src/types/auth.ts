export const LOGIN_ROUTE = "/admin/login";
export const DASHBOARD = "/dashboard";
export const HOTEL_LOGIN_ROUTE = "/hotels/login";
export const HOTEL_LOGIN_URL = "https://hotels.thehotelmedia.com/hotels/login";
export const HOTEL_DASHBOARD = "/hotels/overview";
export enum AuthenticationProvider {
    ADMIN = "admin-authentication-provider",
    USER = "user-credentials-provider",
    HOTEL = "hotel-credentials-provider",
}
export enum Role {
    ADMIN = "administrator",
    USER = "user"
}