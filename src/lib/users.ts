import { UserProfile } from './../types/user';
import axios from "axios";
import AppConfig from "@/config/constants";
import { BusinessProfileRef } from "@/types/user";

export interface ReviewQuestion {
    _id: string
    question: string
    id: string
}
async function getUser(id: string | undefined, userID: string | undefined) {
    try {
        const response = await axios.get(`${AppConfig.API_ENDPOINT}/share/users`, {
            params: {
                id: id,
                userID: userID
            }
        });
        if (response.status === 200 && response.data && response.data.status) {
            return response.data.data as UserProfile;
        }
        return null;
    } catch (error) {
        console.log("getUser :::", error);
        return null;
    }
}

async function getBusinessProfile(encryptedID: string) {
    try {
        const response = await axios.get(`${AppConfig.API_ENDPOINT}/business/public/${encryptedID}`);
        if (response.status === 200 && response.data && response.data.status) {
            return response.data.data as {
                businessProfileRef: BusinessProfileRef
                reviewQuestions: ReviewQuestion[]
            };
        }
        return null;
    } catch (error) {
        console.log("getBusinessProfile :::", error);
        return null;
    }
}
export { getUser, getBusinessProfile }