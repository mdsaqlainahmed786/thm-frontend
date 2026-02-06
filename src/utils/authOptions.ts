import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AppConfig from "@/config/constants";
import axios from "axios";
import { cookies } from 'next/headers'
import { AuthenticationProvider } from "@/types/auth";
import { LOGIN_ROUTE } from "@/types/auth";

/**
 * IMPORTANT (production stability):
 * Excessive `console.log` in Next.js/NextAuth (especially printing large objects / tokens)
 * can block the Node.js event loop and cause nginx 504s under traffic spikes.
 *
 * Logging is therefore OFF by default in production.
 * Enable explicitly by setting AUTH_DEBUG=true.
 */
const AUTH_DEBUG = process.env.AUTH_DEBUG === "true";
const isProd = process.env.NODE_ENV === "production";
const shouldLog = AUTH_DEBUG || !isProd;

const authLog = (...args: any[]) => {
    if (shouldLog) console.log(...args);
};
const authWarn = (...args: any[]) => {
    if (shouldLog) console.warn(...args);
};
// Errors are kept but we avoid dumping huge objects/tokens unless debug is enabled.
const authError = (...args: any[]) => {
    if (shouldLog) console.error(...args);
    else console.error(args?.[0] ?? "[AUTH] error");
};

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

function extractCookieNames(setCookieHeader: string[] | string | undefined): string[] {
    if (!setCookieHeader) return [];
    const cookiesArr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    return cookiesArr
        .filter((c): c is string => typeof c === 'string')
        .map((c) => c.split('=')[0]?.trim())
        .filter((n): n is string => !!n);
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
        authError('[AUTH] Error decoding JWT');
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
                    authLog('[AUTH] Clearing hotel cookies before setting admin cookies');
                    cookieStore.delete('X-Access-Token');
                    cookieStore.delete('SessionToken');
                    
                    // Admin uses separate cookie names
                    const accessCookieOptions = getAccessCookieOptions();
                    const refreshCookieOptions = getRefreshCookieOptions();
                    authLog('[AUTH] Setting admin cookies:', {
                        hasAccessToken: !!user?.accessToken,
                        hasRefreshToken: !!user?.refreshToken
                    });
                    
                    // Some backends return refresh token via Set-Cookie (httpOnly), not JSON.
                    // We require an accessToken here (used by client-side axios). Refresh token is optional.
                    if (!user?.accessToken) {
                        authError('[AUTH] Missing accessToken in admin user object');
                        throw new Error("Invalid response from server: missing access token");
                    }
                    const setCookieHeader = (response.headers as any)?.['set-cookie'] as string[] | string | undefined;
                    authLog('[AUTH] Admin login response set-cookie header present:', !!setCookieHeader);
                    if (setCookieHeader) {
                        authLog('[AUTH] Admin login set-cookie cookie names:', extractCookieNames(setCookieHeader));
                    }
                    
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
                        authWarn('[AUTH] Admin refreshToken missing in JSON and Set-Cookie; AdminSessionToken will not be set');
                    }
                    
                    // Verify cookies were set
                    const setAdminAccessToken = cookieStore.get('X-Admin-Access-Token');
                    const setAdminSessionToken = cookieStore.get('AdminSessionToken');
                    authLog('[AUTH] Admin cookies set - verification:', {
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
                try {
                    //Backend api for login
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
                    authLog('[AUTH] Hotel login API duration(ms):', apiDuration);
                    
                    if (!response.data?.status && response.data?.statusCode !== 200) {
                        authError('[AUTH] Hotel login API returned error status');
                        throw new Error(response.data?.message ?? "Something went wrong");
                    }
                    const user = response.data?.data;
                    
                    if (user && user.accountType && user.accountType !== "business") {
                        authError('[AUTH] Account type mismatch');
                        throw new Error("You don't have the right permission to access this page.")
                    }
                    const cookieStore = await cookies();
                    
                    // CRITICAL: Clear any existing admin cookies to prevent cross-contamination
                    authLog('[AUTH] Clearing admin cookies before setting hotel cookies');
                    cookieStore.delete('X-Admin-Access-Token');
                    cookieStore.delete('AdminSessionToken');
                    
                    const accessCookieOptions = getAccessCookieOptions();
                    const refreshCookieOptions = getRefreshCookieOptions();
                    
                    // Some backends return refresh token via Set-Cookie (httpOnly), not JSON.
                    // We require an accessToken here (used by client-side axios). Refresh token is optional.
                    if (!user?.accessToken) {
                        authError('[AUTH] Missing accessToken in user object');
                        throw new Error("Invalid response from server: missing access token");
                    }
                    const setCookieHeader = (response.headers as any)?.['set-cookie'] as string[] | string | undefined;
                    authLog('[AUTH] Hotel login response set-cookie header present:', !!setCookieHeader);
                    if (setCookieHeader) {
                        authLog('[AUTH] Hotel login set-cookie cookie names:', extractCookieNames(setCookieHeader));
                    }
                    
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
                    } else {
                        authWarn('[AUTH] Hotel refreshToken missing in JSON and Set-Cookie; SessionToken will not be set (middleware will redirect)');
                    }
                    
                    // Verify cookies were set
                    const setAccessToken = cookieStore.get('X-Access-Token');
                    const setSessionToken = cookieStore.get('SessionToken');
                    return user;
                } catch (error: any) {
                    authError('[AUTH] Error in hotel authorize');
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
    // IMPORTANT: keep this in env in prod; fallback prevents token decode mismatch in middleware
    secret: process.env.NEXTAUTH_SECRET || "rCpp0FxsnpdW76Nyb7BUdddd",
    pages: {
        signIn: LOGIN_ROUTE,
    },
    callbacks: {
        //step 2
        async session({ session, token, user, newSession, trigger }) {
            if (trigger === "update" && newSession?.name) {
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
                session.user.businessProfilePic = (token as any).businessProfilePic;
                session.user.accessToken = token.accessToken;
                session.user.username = token.username;
                session.user.role = token.role;
                session.user.accountType = token.accountType;
                session.user.businessName = token.businessName;
                session.user.businessTypeName = token.businessTypeName;
            } else {
                authWarn('[SESSION] No token provided to session callback');
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
                // Store business logo separately (for top-right header avatar)
                (token as any).businessProfilePic = user?.businessProfileRef?.profilePic ?? (token as any).businessProfilePic;
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.accountType = user.accountType;
                if (account && account.provider === AuthenticationProvider.HOTEL) {
                    let decodedToken: any = null;
                    if (user.accessToken) {
                        decodedToken = decodeJWT(user.accessToken);
                    } else {
                        authWarn('[JWT] No accessToken in user object');
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
            } else {
                authLog('[JWT] No user object, returning existing token');
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            const isProd = process.env.NODE_ENV === 'production';
            const isLocalBase =
                baseUrl.includes('localhost') ||
                baseUrl.includes('127.0.0.1') ||
                baseUrl.includes('0.0.0.0');
            const configuredPublicBase =
                process.env.NEXT_PUBLIC_HOST ||
                process.env.NEXTAUTH_URL ||
                '';
            const configuredPublicOrigin = (() => {
                if (!configuredPublicBase) return undefined;
                try {
                    const u = new URL(
                        configuredPublicBase.startsWith('http')
                            ? configuredPublicBase
                            : `https://${configuredPublicBase}`
                    );
                    return u.origin;
                } catch {
                    return undefined;
                }
            })();
            const safeBaseUrl =
                (isProd && isLocalBase && configuredPublicOrigin) ? configuredPublicOrigin : baseUrl;

            // Always allow redirects to our own subdomains
            if (url.includes('thehotelmedia.com')) {
                return url;
            }
            // Default behavior
            if (url.startsWith("/")) return `${safeBaseUrl}${url}`
            else if (new URL(url).origin === new URL(safeBaseUrl).origin) return url
            return safeBaseUrl
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