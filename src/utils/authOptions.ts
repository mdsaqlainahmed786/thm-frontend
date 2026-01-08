import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AppConfig from "@/config/constants";
import axios from "axios";
import { cookies } from 'next/headers'
import { AuthenticationProvider } from "@/types/auth";
import { LOGIN_ROUTE } from "@/types/auth";

// Helper function to decode JWT token
function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
                .toString()
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: AuthenticationProvider.ADMIN,
            name: 'admin-login',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    //Backend api for login
                    const response = await axios({
                        url: `${AppConfig.API_ENDPOINT}/admin/auth/login`,
                        method: "POST",
                        data: {
                            email: credentials?.email,
                            password: credentials?.password,
                            deviceID: 'SM_MFZWI3D-BONSGYC-YLTMRW',
                            notificationToken: 'SM_MFZWI3D-BONSGYC-YLTMRW',
                            devicePlatform: 'web'
                        },
                        withCredentials: true
                    });
                    if (!response.data?.status && response.data?.statusCode !== 200) {
                        throw new Error(response.data?.message ?? "Something went wrong");
                    }
                    const user = response.data?.data;
                    const cookieStore = await cookies();
                    // Admin uses separate cookie names
                    cookieStore.set('X-Admin-Access-Token', user.accessToken, { secure: false });
                    cookieStore.set('AdminSessionToken', user.refreshToken, { secure: false });
                    return user;
                } catch (error: any) {
                    const { response } = error;
                    if (response) {
                        const { data } = response;
                        if (data && data?.message) {
                            throw new Error(data?.message ?? "Something went wrong");
                        }
                        throw new Error(error.message ?? "Something went wrong");
                    }
                    throw new Error(error.message ?? "Something went wrong");
                }
            }
        }),
        CredentialsProvider({
            id: AuthenticationProvider.HOTEL,
            name: 'hotel-login',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    //Backend api for login
                    const response = await axios({
                        url: `${AppConfig.API_ENDPOINT}/auth/login`,
                        method: "POST",
                        data: {
                            email: credentials?.email,
                            password: credentials?.password,
                            deviceID: 'SM_MFZWI3D-BONSGYC-YLTMRW',
                            notificationToken: 'SM_MFZWI3D-BONSGYC-YLTMRW',
                            devicePlatform: 'web'
                        },
                        withCredentials: true
                    });
                    if (!response.data?.status && response.data?.statusCode !== 200) {
                        throw new Error(response.data?.message ?? "Something went wrong");
                    }
                    const user = response.data?.data;
                    if (user && user.accountType && user.accountType !== "business") {
                        throw new Error("You don't have the right permission to access this page.")
                    }
                    const cookieStore = await cookies();
                    cookieStore.set('X-Access-Token', user.accessToken, { secure: false });
                    cookieStore.set('SessionToken', user.refreshToken, { secure: false });
                    return user;
                } catch (error: any) {
                    const { response } = error;
                    if (response) {
                        const { data } = response;
                        if (data && data?.message) {
                            throw new Error(data?.message ?? "Something went wrong");
                        }
                        throw new Error(error.message ?? "Something went wrong");
                    }
                    throw new Error(error.message ?? "Something went wrong");
                }
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    secret: "rCpp0FxsnpdW76Nyb7BUdddd",
    pages: {
        signIn: LOGIN_ROUTE,
    },
    callbacks: {
        //step 2
        async session({ session, token, user, newSession, trigger }) {
            if (trigger === "update" && newSession?.name) {
                console.log(newSession, "new Session");
                session.user.name = newSession.name
            }
            if (trigger === "update" && newSession?.username) {
                session.user.username = newSession.username
            }
            if (trigger === "update" && newSession?.profilePic) {
                session.user.profilePic = newSession.profilePic
            }
            if (token) {
                session.user._id = token._id;
                session.user.name = token.name;
                session.user.profilePic = token.profilePic;
                session.user.accessToken = token.accessToken;
                session.user.username = token.username;
                session.user.role = token.role;
                session.user.accountType = token.accountType;
                session.user.businessName = token.businessName;
                session.user.businessTypeName = token.businessTypeName;
            }
            return session;
        },
        //step 1
        async jwt({ token, user, account, profile, trigger, session }) {
            if (trigger === "update") {
                if (session.name) {
                    token.name = session.name;
                }
                if (session.username) {
                    token.username = session.username;
                }
                if (session.profilePic) {
                    token.profilePic = session.profilePic;
                }
            }
            if (user) {
                token.role = user.role;
                token._id = user.id;
                token.name = user.name;
                token.profilePic = user.profilePic;
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.accountType = user.accountType;
                if (account && account.provider === AuthenticationProvider.HOTEL) {
                    let decodedToken: any = null;
                    if (user.accessToken) {
                        decodedToken = decodeJWT(user.accessToken);
                    }

                    let businessTypeName = user?.businessProfileRef?.businessTypeRef?.name || "";
                    if (!businessTypeName && decodedToken?.businessTypeName) {
                        businessTypeName = decodedToken.businessTypeName;
                    }

                    let businessName = user?.businessProfileRef?.name || "";
                    if (!businessName && decodedToken?.businessName) {
                        businessName = decodedToken.businessName;
                    }

                    token.businessName = businessName;
                    token.businessTypeName = businessTypeName;
                }
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Always allow redirects to our own subdomains
            if (url.includes('thehotelmedia.com')) {
                return url;
            }
            // Default behavior
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === new URL(baseUrl).origin) return url
            return baseUrl
        }
    },
    events: {
        async signOut({ session, token }) {
            const cookieStore = await cookies();
            // Clear admin cookies
            cookieStore.delete('X-Admin-Access-Token');
            cookieStore.delete('AdminSessionToken');
            // Clear user/hotel cookies
            cookieStore.delete('X-Access-Token');
            cookieStore.delete('SessionToken');
        },

    }
}

export default authOptions;