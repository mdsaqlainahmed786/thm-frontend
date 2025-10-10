import axios from "axios";
import BrokenPage from "@/components/BrokenPage";
import AppConfig from "@/config/constants";
import { Metadata } from "next";
import { truncateString } from "@/utils/basic";
import { redirect } from "next/navigation";
import { headers, draftMode } from "next/headers";
import Link from "next/link";
import { getUser } from "@/lib/users";
import DownloadApp from "@/components/DownloadApp";
interface Params {
    params: {
        id: string;
    };
    searchParams?: Record<string, string>;
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
    const id = searchParams?.id;
    const userID = searchParams?.userID;
    const user = await getUser(id, userID);
    if (user) {
        const title = `${user.name} | User`;
        const description = truncateString(user.bio, 145);
        const media = (user.profilePic && user.profilePic.small) ? user.profilePic.small : '';
        return {
            title: title,
            description: description,
            openGraph: {
                title: title,
                description: description,
                type: 'website',
                images: {
                    url: media,
                }
            },
            twitter: {
                title: title,
                description: description,
                images: {
                    url: media,
                }
            }
        };
    } else {
        return {
            title: 'Page not found',
            description: 'Sorry, this page isn\'t available.',
        }
    }
}
interface PostProps {
    params: {
        slug: string;
    };
    searchParams: {
        [key: string]: string | undefined
    },
}

export default async function Post({ params, searchParams }: PostProps): Promise<JSX.Element> {
    const id = searchParams.id;
    const userID = searchParams.userID;
    const post = await getUser(id, userID);
    const head = headers().get('user-agent');
    if (head && (head.match(/chrome|chromium|crios/i) || head.match(/firefox|fxios/i) || head.match(/safari/i) || head.match(/msie|trident/i) || head.match(/edg/i) || head.match(/opera|opr/i))) {
        console.log('Google Chrome');
    }
    if (!post) {
        return <BrokenPage />; // Return a 404 component
    }
    return (<DownloadApp />);
}
