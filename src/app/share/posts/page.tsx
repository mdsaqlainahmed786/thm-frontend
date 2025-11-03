import axios from "axios";
import BrokenPage from "@/components/BrokenPage";
import AppConfig from "@/config/constants";
import { Metadata } from "next";
import { truncateString } from "@/utils/basic";
import { redirect } from "next/navigation";
import { headers, draftMode } from "next/headers";
import Link from "next/link";
import { getPost } from "@/lib/posts";
import DownloadApp from "@/components/DownloadApp";

interface Params {
    params: {
        id: string;
    };
    searchParams?: Record<string, string>;
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
    const postID = searchParams?.postID;
    const userID = searchParams?.userID;

    if (!postID || !userID) {
        return {
            title: 'Page not found',
            description: 'Sorry, this page isn’t available.',
        };
    }

    try {
        const post = await getPost(userID, postID, true);
        if (post) {
            const title = `${truncateString(post.content, 50)} | ${post.postType.toUpperCase()}`;
            const description = truncateString(post.content, 145);
            const media = (post.mediaRef && post.mediaRef.length !== 0) ? post.mediaRef[0].thumbnailUrl : '/images/banner.svg';
            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    type: 'website',
                    images: {
                        url: media,
                    }
                },
                twitter: {
                    title,
                    description,
                    images: {
                        url: media,
                    }
                }
            };
        } else {
            return {
                title: 'Page not found',
                description: 'Sorry, this page isn’t available.',
            };
        }
    } catch (error) {
        return {
            title: 'Error loading page',
            description: 'Sorry, there was an error loading the post.',
        };
    }
}

interface PostProps {
    params: {
        slug: string;
    };
    searchParams: {
        [key: string]: string | undefined;
    };
}

export default async function Post({ params, searchParams }: PostProps): Promise<JSX.Element> {
    const postID = searchParams.postID;
    const userID = searchParams.userID;

    if (!postID || !userID) {
        return <BrokenPage />; // Return a 404 component if postID or userID are missing
    }

    try {
        const post = await getPost(userID, postID);
        const head = headers().get('user-agent');
        if (head && (head.match(/chrome|chromium|crios/i) || head.match(/firefox|fxios/i) || head.match(/safari/i) || head.match(/msie|trident/i) || head.match(/edg/i) || head.match(/opera|opr/i))) {
            console.log('Google Chrome');
        }

        if (!post) {
            return <BrokenPage />; // Return a 404 component if post not found
        }

        return <DownloadApp />; // Return the app download component if post found
    } catch (error) {
        return <BrokenPage />; // Handle errors gracefully
    }
}
