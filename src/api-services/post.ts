import apiRequest from "./app-client";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "./api-errors";
import { Post } from "@/types/post";
import moment from "moment";
const fetchPost = async (userID: string) => {
    try {
        const response = await apiRequest.get(`/admin/users/${userID}`);
        if (response.status === 200 && response.data.status) {
            const responseData = response.data.data;
            return responseData as UserProfile;
        } else {
            toast.error("Something went wrong");
            return undefined;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return undefined;
    }
}
const fetchPosts = async (params: { [key: string]: any }) => {
    try {
        const paramsKey = Object.keys(params);
        const apiParams = {};
        paramsKey && paramsKey.map((key) => {
            if (key && params[key] && params[key] !== '') {
                Object.assign(apiParams, { [key]: params[key] })
            }
        })
        const response = await apiRequest.get(`/admin/posts`, {
            params: apiParams
        });
        if (response.status === 200 && response.data.status) {
            const responseData = response.data;
            return responseData as {
                data: Post[];
                pageNo: number;
                totalPages: number;
                totalResources: number
            };
        } else {
            toast.error("Something went wrong");
            return null;
        }
    } catch (error) {
        handleClientApiErrors(error)
        return null;
    }
}

interface EngagementData {
    date: string;
    views: number;
    likes: number;
    reports: number;
}

const fetchPostEngagement = async () => {
    try {
        const endDate = moment();
        const startDate = moment().subtract(30, "days");

        const apiParams: { [key: string]: any } = {
            documentLimit: 10000,
            pageNumber: 1,
        };

        const response = await apiRequest.get(`/admin/posts`, {
            params: apiParams
        });

        if (response.status === 200 && response.data.status) {
            const posts = response.data.data as Post[];

            // Group posts by date and aggregate views, likes, and reports
            const engagementMap = new Map<string, { views: number; likes: number; reports: number }>();

            posts.forEach((post) => {
                if (post.createdAt) {
                    const postDate = moment(post.createdAt);
                    if (postDate.isSameOrAfter(startDate) && postDate.isSameOrBefore(endDate)) {
                        const dateKey = postDate.format("YYYY-MM-DD");

                        const current = engagementMap.get(dateKey) || { views: 0, likes: 0, reports: 0 };
                        engagementMap.set(dateKey, {
                            views: current.views + (post.views ?? 0),
                            likes: current.likes + (post.likeCount ?? post.likes?.length ?? 0),
                            reports: current.reports + (post.reportCount ?? 0),
                        });
                    }
                }
            });

            // Fill in all dates in range with 0 counts for missing dates
            const filledData: EngagementData[] = [];
            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate)) {
                const dateKey = currentDate.format("YYYY-MM-DD");
                const existingData = engagementMap.get(dateKey);
                filledData.push({
                    date: dateKey,
                    views: existingData?.views || 0,
                    likes: existingData?.likes || 0,
                    reports: existingData?.reports || 0,
                });

                currentDate.add(1, "day");
            }

            return filledData;
        } else {
            toast.error("Something went wrong");
            return [];
        }
    } catch (error) {
        handleClientApiErrors(error);
        return [];
    }
};

interface TypeDistributionData {
    post: number;
    event: number;
    review: number;
}

const fetchPostTypeDistribution = async () => {
    try {
        const apiParams: { [key: string]: any } = {
            documentLimit: 10000,
            pageNumber: 1,
        };

        const response = await apiRequest.get(`/admin/posts`, {
            params: apiParams
        });

        if (response.status === 200 && response.data.status) {
            const posts = response.data.data as Post[];

            const distribution: TypeDistributionData = {
                post: 0,
                event: 0,
                review: 0,
            };

            posts.forEach((post) => {
                const postType = post.postType?.toLowerCase();
                if (postType === "post") {
                    distribution.post++;
                } else if (postType === "event") {
                    distribution.event++;
                } else if (postType === "review") {
                    distribution.review++;
                }
            });

            return distribution;
        } else {
            toast.error("Something went wrong");
            return { post: 0, event: 0, review: 0 };
        }
    } catch (error) {
        handleClientApiErrors(error);
        return { post: 0, event: 0, review: 0 };
    }
};

export { fetchPost, fetchPosts, fetchPostEngagement, fetchPostTypeDistribution }