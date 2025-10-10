import { Metadata } from "next";
import AppConfig from "@/config/constants";
export const metadata: Metadata = {
    title: "About Us",
};
export default function PrivacyPolicy() {
    return (
        <div className="mx-auto flex justify-center items-center">
            <div className="max-w-6xl text-center">
                <a className="flex justify-center my-10" href="/">
                    <img alt="Logo" fetchPriority="high" width="100" height="100" decoding="async" data-nimg="1" className="dark:hidden" src="/images/logo/logo.svg" style={{ color: "transparent" }} />
                    <img alt="Logo" fetchPriority="high" width="100" height="100" decoding="async" data-nimg="1" className="hidden dark:block" src="/images/logo/logo.svg" style={{ color: "transparent" }} />
                </a>
                <h1 className="text-4xl font-semibold text-black dark:text-white text-center my-7">About US</h1>
                {/* <p className="text-base font-medium mt-4.5 text-center">Last updated: November 13, 2024</p> */}
                <p className="text-base font-medium mt-4.5">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                <p className="text-base font-medium mt-4.5">If you have any questions about this Privacy Policy, You can contact us:</p>
                <ul className="flex flex-col gap-4 mt-5">
                    <li>
                        <p className="text-base font-medium">By email: <a className="font-medium text-primary underline" href={`mailto:${AppConfig.COMPANY_EMAIL}`}>contact@thehotelmedia.com</a></p>
                    </li>
                    <li>
                        <p className="text-base font-medium">By visiting this page on our website: <a className="font-medium text-primary underline" href="https://thehotelmedia.com/" rel="external nofollow noopener" target="_blank">https://thehotelmedia.com/</a></p>
                    </li>
                    <li>
                        <p className="text-base font-medium">By phone number:  <a className="font-medium text-primary underline" href={`tel:${AppConfig.COMPANY_PHONE_NUMBER}`}>{AppConfig.COMPANY_PHONE_NUMBER}</a></p>
                    </li>
                </ul>
            </div>
        </div>
    )
}