import BrokenPage from "@/components/BrokenPage";
import { Metadata } from "next";
import { truncateString } from "@/utils/basic";
import { headers, draftMode } from "next/headers";
import DownloadApp from "@/components/DownloadApp";
import { getBusinessProfile } from "@/lib/users";
import Image from "next/image";
import Link from "next/link";
import ReviewForm from "./ReviewForm";
interface PageProps {
    searchParams: {
        [key: string]: string | undefined
    },
}
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const encryptedID = searchParams.id ?? 'data';
    const businessProfile = await getBusinessProfile(encryptedID);
    if (businessProfile && businessProfile.businessProfileRef) {
        const title = 'Share your experience at "' + businessProfile.businessProfileRef.name + '"';
        const media = businessProfile.businessProfileRef.coverImage ?
            businessProfile.businessProfileRef.coverImage :
            businessProfile?.businessProfileRef?.profilePic?.large ?
                businessProfile?.businessProfileRef?.profilePic?.large :
                '/images/banner.svg';
        const description = ''
        return {
            title: title,
            // description: description,
            openGraph: {
                title: title,
                // description: description,
                type: 'website',
                images: {
                    url: media,
                }
            },
            twitter: {
                title: title,
                // description: description,
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




export default async function Post({ searchParams }: PageProps): Promise<JSX.Element> {
    const encryptedID = searchParams?.id ?? 'data';
    const placeID = searchParams?.placeID ?? '';
    const businessProfile = await getBusinessProfile(encryptedID);
    const head = headers().get('user-agent');
    if (head && (head.match(/chrome|chromium|crios/i) || head.match(/firefox|fxios/i) || head.match(/safari/i) || head.match(/msie|trident/i) || head.match(/edg/i) || head.match(/opera|opr/i))) {
        console.log('Google Chrome');
    }
    if (!businessProfile) {
        return <BrokenPage />; // Return a 404 component
    }
    return (
        <main className=" flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-2 sm:px-4 py-5">
            <div className="relative w-full max-w-125 rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-3 xsm:px-4 sm:px-6 py-8 text-center md:px-9 md:py-8">
                <ReviewForm id={encryptedID} businessProfile={businessProfile.businessProfileRef} placeID={placeID} reviewQuestions={(businessProfile && businessProfile.reviewQuestions && businessProfile.reviewQuestions) ?? []} />
            </div>
        </main>
    );
}
