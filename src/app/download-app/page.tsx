
import BrokenPage from "@/components/BrokenPage";
import { Metadata } from "next";
import { headers, draftMode } from "next/headers";
import DownloadApp from "@/components/DownloadApp";
import AppConfig from "@/config/constants";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
    title: "Download The Hotel Media App for iOS and Android",
}
export default async function Post(): Promise<JSX.Element> {
    const head = headers().get('user-agent');
    console.log(head);
    // if (head && (head.match(/chrome|chromium|crios/i) || head.match(/firefox|fxios/i) || head.match(/safari/i) || head.match(/msie|trident/i) || head.match(/edg/i) || head.match(/opera|opr/i))) {
    //     console.log('Google Chrome');
    // }
    if (head && head.match(/android/i)) {
        console.log('Android Device');
        redirect(AppConfig.PLAY_STORE_LINK);
    }
    if (head && head.match(/iphone|ipad|ipod/i)) {
        console.log('Iphone Device');
        redirect(AppConfig.APP_STORE_LINK);
    }

    return (<DownloadApp />);
}
