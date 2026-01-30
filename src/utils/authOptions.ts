import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AppConfig from "@/config/constants";
import axios from "axios";
import { cookies } from 'next/headers'
import { AuthenticationProvider } from "@/types/auth";
import { LOGIN_ROUTE } from "@/types/auth";

// Cookie options for Safari compatibility
// Access tokens need to be readable by JavaScript (for axios interceptors)
// Refresh tokens should be httpOnly (server-only)
const getAccessCookieOptions = () => ({
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
    sameSite: 'lax' as const, // Required for Safari compatibility
    path: '/', // Ensure cookies work across all routes
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds (604800)
    // Note: httpOnly is NOT set because access tokens need to be readable by JavaScript
});

const getRefreshCookieOptions = () => ({
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
});

function extractCookieValue(setCookieHeader: string[] | string | undefined, cookieName: string): string | undefined {
    if (!setCookieHeader) return undefined;
    const cookiesArr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    for (const cookieStr of cookiesArr) {
        // Example: "SessionToken=abc123; Path=/; HttpOnly; Secure; SameSite=Lax"
        if (typeof cookieStr !== 'string') continue;
        const prefix = `${cookieName}=`;
        if (cookieStr.startsWith(prefix)) {
            const valuePart = cookieStr.slice(prefix.length);
            const value = valuePart.split(';')[0];
            return value || undefined;
        }
    }
    return undefined;
}

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
                    
                    // CRITICAL: Clear any existing hotel cookies to prevent cross-contamination
                    console.log('[AUTH] Clearing hotel cookies before setting admin cookies');
                    cookieStore.delete('X-Access-Token');
                    cookieStore.delete('SessionToken');
                    
                    // Admin uses separate cookie names
                    const accessCookieOptions = getAccessCookieOptions();
                    const refreshCookieOptions = getRefreshCookieOptions();
                    console.log('[AUTH] Setting admin cookies:', {
                        hasAccessToken: !!user?.accessToken,
                        hasRefreshToken: !!user?.refreshToken
                    });
                    
                    // Some backends return refresh token via Set-Cookie (httpOnly), not JSON.
                    // We require an accessToken here (used by client-side axios). Refresh token is optional.
                    if (!user?.accessToken) {
                        console.error('[AUTH] Missing accessToken in admin user object');
                        throw new Error("Invalid response from server: missing access token");
                    }
                    const setCookieHeader = (response.headers as any)?.['set-cookie'] as string[] | string | undefined;
                    console.log('[AUTH] Admin login response set-cookie header present:', !!setCookieHeader);
                    
                    cookieStore.set('X-Admin-Access-Token', user.accessToken, accessCookieOptions);
                    const adminRefreshTokenFromBody = user?.refreshToken as string | undefined;
                    const adminRefreshTokenFromCookie =
                        extractCookieValue(setCookieHeader, 'AdminSessionToken') ??
                        extractCookieValue(setCookieHeader, 'adminRefreshToken') ??
                        extractCookieValue(setCookieHeader, 'refreshToken');
                    const adminRefreshToken = adminRefreshTokenFromBody || adminRefreshTokenFromCookie;
                    if (adminRefreshToken) {
                        cookieStore.set('AdminSessionToken', adminRefreshToken, refreshCookieOptions);
                    } else {
                        console.warn('[AUTH] Admin refreshToken missing in JSON and Set-Cookie; AdminSessionToken will not be set');
                    }
                    
                    // Verify cookies were set
                    const setAdminAccessToken = cookieStore.get('X-Admin-Access-Token');
                    const setAdminSessionToken = cookieStore.get('AdminSessionToken');
                    console.log('[AUTH] Admin cookies set - verification:', {
                        accessTokenSet: !!setAdminAccessToken,
                        sessionTokenSet: !!setAdminSessionToken
                    });
                    
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
                console.log('[AUTH] HOTEL authorize called at:', new Date().toISOString());
                console.log('[AUTH] Credentials received:', {
                    hasEmail: !!credentials?.email,
                    emailLength: credentials?.email?.length,
                    hasPassword: !!credentials?.password,
                    passwordLength: credentials?.password?.length
                });
                try {
                    //Backend api for login
                    console.log('[AUTH] Making API request to:', `${AppConfig.API_ENDPOINT}/auth/login`);
                    const apiStartTime = Date.now();
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
                    const apiDuration = Date.now() - apiStartTime;
                    console.log('[AUTH] API response received in', apiDuration, 'ms');
                    console.log('[AUTH] API response status:', response.status);
                    console.log('[AUTH] API response data status:', response.data?.status);
                    console.log('[AUTH] API response statusCode:', response.data?.statusCode);
                    
                    if (!response.data?.status && response.data?.statusCode !== 200) {
                        console.error('[AUTH] API returned error status:', response.data?.message);
                        throw new Error(response.data?.message ?? "Something went wrong");
                    }
                    const user = response.data?.data;
                    console.log('[AUTH] User data received:', {
                        hasUser: !!user,
                        hasAccessToken: !!user?.accessToken,
                        hasRefreshToken: !!user?.refreshToken,
                        accountType: user?.accountType,
                        userId: user?.id || user?._id,
                        userName: user?.name
                    });
                    
                    if (user && user.accountType && user.accountType !== "business") {
                        console.error('[AUTH] Account type mismatch:', user.accountType);
                        throw new Error("You don't have the right permission to access this page.")
                    }
                    const cookieStore = await cookies();
                    
                    // CRITICAL: Clear any existing admin cookies to prevent cross-contamination
                    console.log('[AUTH] Clearing admin cookies before setting hotel cookies');
                    cookieStore.delete('X-Admin-Access-Token');
                    cookieStore.delete('AdminSessionToken');
                    
                    const accessCookieOptions = getAccessCookieOptions();
                    const refreshCookieOptions = getRefreshCookieOptions();
                    console.log('[AUTH] Setting hotel cookies with options:', {
                        secure: accessCookieOptions.secure,
                        sameSite: accessCookieOptions.sameSite,
                        path: accessCookieOptions.path,
                        maxAge: accessCookieOptions.maxAge,
                        hasAccessToken: !!user?.accessToken,
                        hasRefreshToken: !!user?.refreshToken,
                        accessTokenLength: user?.accessToken?.length,
                        refreshTokenLength: user?.refreshToken?.length
                    });
                    
                    // Some backends return refresh token via Set-Cookie (httpOnly), not JSON.
                    // We require an accessToken here (used by client-side axios). Refresh token is optional.
                    if (!user?.accessToken) {
                        console.error('[AUTH] Missing accessToken in user object:', {
                            hasAccessToken: !!user?.accessToken,
                            hasRefreshToken: !!user?.refreshToken
                        });
                        throw new Error("Invalid response from server: missing access token");
                    }
                    const setCookieHeader = (response.headers as any)?.['set-cookie'] as string[] | string | undefined;
                    console.log('[AUTH] Hotel login response set-cookie header present:', !!setCookieHeader);
                    
                    cookieStore.set('X-Access-Token', user.accessToken, accessCookieOptions);
                    const refreshTokenFromBody = user?.refreshToken as string | undefined;
                    // Backend seems to set refresh token via Set-Cookie on API host; we mirror it into our own SessionToken cookie
                    const refreshTokenFromCookie =
                        extractCookieValue(setCookieHeader, 'SessionToken') ??
                        extractCookieValue(setCookieHeader, 'userRefreshToken') ??
                        extractCookieValue(setCookieHeader, 'refreshToken');
                    const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;
                    if (refreshToken) {
                        cookieStore.set('SessionToken', refreshToken, refreshCookieOptions);
                        console.log('[AUTH] SessionToken set from', refreshTokenFromBody ? 'response body' : 'set-cookie header');
                    } else {
                        console.warn('[AUTH] Hotel refreshToken missing in JSON and Set-Cookie; SessionToken will not be set (middleware will redirect)');
                    }
                    
                    // Verify cookies were set
                    const setAccessToken = cookieStore.get('X-Access-Token');
                    const setSessionToken = cookieStore.get('SessionToken');
                    console.log('[AUTH] Cookies set - verification:', {
                        accessTokenSet: !!setAccessToken,
                        sessionTokenSet: !!setSessionToken,
                        accessTokenValue: setAccessToken?.value ? 'exists' : 'missing',
                        sessionTokenValue: setSessionToken?.value ? 'exists' : 'missing'
                    });
                    
                    console.log('[AUTH] Returning user object');
                    return user;
                } catch (error: any) {
                    console.error('[AUTH] Error in authorize:', {
                        message: error?.message,
                        hasResponse: !!error?.response,
                        responseStatus: error?.response?.status,
                        responseData: error?.response?.data,
                        stack: error?.stack
                    });
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
            console.log('[SESSION] Session callback called:', {
                trigger,
                hasToken: !!token,
                hasUser: !!user,
                hasNewSession: !!newSession,
                hasSession: !!session
            });
            
            if (trigger === "update" && newSession?.name) {
                console.log('[SESSION] Updating session name:', newSession);
                session.user.name = newSession.name
            }
            if (trigger === "update" && newSession?.username) {
                console.log('[SESSION] Updating session username:', newSession.username);
                session.user.username = newSession.username
            }
            if (trigger === "update" && newSession?.profilePic) {
                console.log('[SESSION] Updating session profilePic:', newSession.profilePic);
                session.user.profilePic = newSession.profilePic
            }
            if (token) {
                console.log('[SESSION] Setting session from token:', {
                    hasId: !!token._id,
                    hasName: !!token.name,
                    hasAccessToken: !!token.accessToken,
                    hasRole: !!token.role,
                    accountType: token.accountType,
                    hasBusinessName: !!token.businessName
                });
                session.user._id = token._id;
                session.user.name = token.name;
                session.user.profilePic = token.profilePic;
                session.user.accessToken = token.accessToken;
                session.user.username = token.username;
                session.user.role = token.role;
                session.user.accountType = token.accountType;
                session.user.businessName = token.businessName;
                session.user.businessTypeName = token.businessTypeName;
                console.log('[SESSION] Session user object set:', {
                    id: session.user._id,
                    name: session.user.name,
                    role: session.user.role,
                    accountType: session.user.accountType
                });
            } else {
                console.warn('[SESSION] No token provided to session callback');
            }
            console.log('[SESSION] Returning session');
            return session;
        },
        //step 1
        async jwt({ token, user, account, profile, trigger, session }) {
            console.log('[JWT] JWT callback called:', {
                trigger,
                hasUser: !!user,
                hasToken: !!token,
                hasAccount: !!account,
                accountProvider: account?.provider,
                hasSession: !!session
            });
            
            if (trigger === "update") {
                console.log('[JWT] Trigger is update, session data:', {
                    hasName: !!session?.name,
                    hasUsername: !!session?.username,
                    hasProfilePic: !!session?.profilePic
                });
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
                console.log('[JWT] User object present, setting token properties:', {
                    hasRole: !!user.role,
                    hasId: !!user.id,
                    hasName: !!user.name,
                    hasAccessToken: !!user.accessToken,
                    accountType: user.accountType,
                    provider: account?.provider
                });
                token.role = user.role;
                token._id = user.id;
                token.name = user.name;
                token.profilePic = user.profilePic;
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.accountType = user.accountType;
                if (account && account.provider === AuthenticationProvider.HOTEL) {
                    console.log('[JWT] Processing HOTEL provider token');
                    let decodedToken: any = null;
                    if (user.accessToken) {
                        decodedToken = decodeJWT(user.accessToken);
                        console.log('[JWT] Decoded token:', {
                            hasDecodedToken: !!decodedToken,
                            hasBusinessTypeName: !!decodedToken?.businessTypeName,
                            hasBusinessName: !!decodedToken?.businessName
                        });
                    } else {
                        console.warn('[JWT] No accessToken in user object');
                    }

                    let businessTypeName = user?.businessProfileRef?.businessTypeRef?.name || "";
                    if (!businessTypeName && decodedToken?.businessTypeName) {
                        businessTypeName = decodedToken.businessTypeName;
                        console.log('[JWT] Using businessTypeName from decoded token:', businessTypeName);
                    } else {
                        console.log('[JWT] Using businessTypeName from user object:', businessTypeName);
                    }

                    let businessName = user?.businessProfileRef?.name || "";
                    if (!businessName && decodedToken?.businessName) {
                        businessName = decodedToken.businessName;
                        console.log('[JWT] Using businessName from decoded token:', businessName);
                    } else {
                        console.log('[JWT] Using businessName from user object:', businessName);
                    }

                    token.businessName = businessName;
                    token.businessTypeName = businessTypeName;
                    console.log('[JWT] Final token business info:', {
                        businessName: token.businessName,
                        businessTypeName: token.businessTypeName
                    });
                }
            } else {
                console.log('[JWT] No user object, returning existing token');
            }
            console.log('[JWT] Returning token with properties:', {
                hasRole: !!token.role,
                hasId: !!token._id,
                hasAccessToken: !!token.accessToken,
                accountType: token.accountType
            });
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