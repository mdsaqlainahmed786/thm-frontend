import { metadata } from './../app/layout';
import axios from "axios";
import AppConfig from "@/config/constants";
import { User } from "@/types/user";
export interface Media {
    _id: string
    businessProfileID: string
    mediaType: string
    mimeType: string
    sourceUrl: string
    thumbnailUrl: string
    duration: number
}

interface Post {
    content: string;
    postedBy: User;
    mediaRef: Media[];
    postType: string;
}
async function getPost(userID: string | undefined, postID: string | undefined, metadata?: boolean) {
    try {
        const response = await axios.get(`${AppConfig.API_ENDPOINT}/share/posts`, {
            params: {
                postID: postID,
                userID: userID,
                metadata: metadata ? "fetch-data" : undefined
            }
        });
        if (response.status === 200 && response.data && response.data.status) {
            return response.data.data as Post;
        }
        return null;
    } catch (error) {
        console.log("getPost :::", error);
        return null;
    }
}
export { getPost }