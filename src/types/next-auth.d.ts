
import 'next-auth';
import NextAuth from "next-auth/next";
import { Role } from './auth';
import { BusinessProfileRef, ProfilePic } from './user';
export type AccountType = "individual" | "business";
declare module "next-auth" {
    interface User {
        _id?: string;
        name?: string;
        username: string;
        profilePic: ProfilePic;
        accessToken: string;
        role: Role;
        accountType: AccountType,
        businessProfileRef: BusinessProfileRef,
    }
    interface Session {
        user: {
            _id?: string;
            name?: string;
            username: string;
            profilePic: ProfilePic;
            businessProfilePic?: ProfilePic;
            accessToken: string;
            role: Role;
            accountType: AccountType,
            businessName: string,
            businessTypeName?: string,
        } & DefaultSession['user']
    }
}
declare module 'next-auth/jwt';

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        name?: string;
        username: string;
        profilePic: ProfilePic;
        businessProfilePic?: ProfilePic;
        accessToken: string;
        role: Role;
        accountType: AccountType,
        businessName: string,
        businessTypeName?: string,
    }
}