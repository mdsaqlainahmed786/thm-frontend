
export default abstract class AppConfig {
    static readonly APP_NAME: string = process.env.APP_NAME!;
    static readonly HOST: string = process.env.NEXT_PUBLIC_HOST || 'https://admin.thehotelmedia.com';
    //API Version
    static readonly API_VERSION: string = "/api/v1";
    static readonly API_ENDPOINT: string = `${this.HOST}${this.API_VERSION}`;

    static readonly SITE_NAME: string = process.env.SITE_NAME as string;
    static readonly COUNTRY: string = 'India';
    static readonly APP_TYPE: string = 'website';
    static readonly COMPANY_NAME: string = 'Indulge Insight Private Limited';
    static readonly COMPANY_PHONE_NUMBER = '+91 9969172347';
    static readonly COMPANY_EMAIL = 'contact@thehotelmedia.com';
    static readonly COMPANY_ADDRESS = {
        STREET: "1st Floor,",
        STREET_1: "ACIC Rise Block 3, CGC Landran,",
        CITY: "Sector 112, SAS Nagar (Mohali)",
        STATE: "PB",
        ZIPCODE: "140307",
        COUNTRY: "INDIA"
    };      /* #183-D, Shivalik Avenue, Near Eco Tower,  Kharar , Punjab 140301 */
    static readonly APP_STORE_LINK = "https://apps.apple.com/in/app/the-hotel-media/id6670192036";
    static readonly PLAY_STORE_LINK = "https://play.google.com/store/apps/details?id=com.thehotelmedia.android";

}
