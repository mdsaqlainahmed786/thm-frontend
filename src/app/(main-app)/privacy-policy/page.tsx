import { Metadata } from "next";
import AppConfig from "@/config/constants";
export const metadata: Metadata = {
    title: "Privacy Policy",
};
export default function PrivacyPolicy() {
    return (
        <div className="mx-auto flex justify-center items-center py-10">
            <div className="max-w-6xl">
                <a className="flex justify-center my-10" href="/">
                    <img alt="Logo" fetchPriority="high" width="100" height="100" decoding="async" data-nimg="1" className="dark:hidden" src="/images/logo/logo.svg" style={{ color: "transparent" }} />
                    <img alt="Logo" fetchPriority="high" width="100" height="100" decoding="async" data-nimg="1" className="hidden dark:block" src="/images/logo/logo.svg" style={{ color: "transparent" }} />
                </a>
                <h1 className="text-4xl font-semibold text-black dark:text-white text-center my-7">Privacy Policy</h1>
                <p className="text-base font-medium mt-4.5 text-center">Last updated: April 29, 2025</p>
                <p className="text-base font-medium mt-4.5">
                    This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use the Service and tells you about your privacy rights and how the law protects You.
                </p>
                <p className="text-base font-medium mt-4.5">
                    We use Your data to provide and improve the Service. By using the Service, you agree to the collection and use of information by this Privacy Policy.
                </p>
                <h2 className="text-title-md text-black dark:text-white my-6">
                    Interpretation and Definitions

                </h2>
                <h3 className="mb-5 text-2xl font-bold leading-[30px] text-black dark:text-white mt-7">
                    Interpretation
                </h3>
                <p className="text-base font-medium mt-4.5">
                    The words whose initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
                </p>
                <h3 className="mb-5 text-2xl font-bold leading-[30px] text-black dark:text-white mt-7">
                    Definitions

                </h3>
                <p className="text-base font-medium mt-4.5">
                    For the purposes of this Privacy Policy:

                </p>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Account </strong>
                            means a unique account created for You to access our Service or parts of our Service.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Affiliate </strong>means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Application </strong>refers to The Hotel Media, the software program provided by the Company.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Company </strong>  refers to <strong className="text-white/80">{AppConfig.COMPANY_NAME}</strong>, {AppConfig.COMPANY_ADDRESS.STREET} {AppConfig.COMPANY_ADDRESS.STREET_1} {AppConfig.COMPANY_ADDRESS.CITY} {AppConfig.COMPANY_ADDRESS.STATE} - {AppConfig.COMPANY_ADDRESS.ZIPCODE}, {AppConfig.COMPANY_ADDRESS.COUNTRY}.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Cookies </strong> are small files placed on Your computer, mobile device, or any other device containing details of Your browsing history among its uses.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80"> Country </strong> refers to: Punjab,  India</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Device </strong> means any device that can access the Service.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Personal Data </strong> is any information relating to an identified or identifiable individual.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Service </strong> refers to the Application or the Website or both.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Service Provider </strong> means any natural or legal person who processes the data on behalf of the Company.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Third-party Social Media Service</strong> refers to any website or social network website through which a User can log in or create an account.</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Usage Data</strong> refers to data collected automatically (for example, the duration of a page visit).</p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">Website</strong> refers to The Hotel Media, accessible from <a className="font-medium text-primary underline" href="https://thehotelmedia.com" rel="external nofollow noopener" target="_blank">https://thehotelmedia.com</a></p>
                    </li>
                    <li>
                        <p className="text-base font-medium"><strong className="text-white/80">You</strong> means the individual or entity accessing or using the Service.</p>
                    </li>
                </ul>
                <h2 className="text-title-md text-black dark:text-white my-6">Collecting and Using Your Personal Data</h2>
                <h3 className="mb-5 text-2xl font-bold leading-[30px] text-black dark:text-white mt-7">Types of Data Collected</h3>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">Personal Data</h4>
                <p className="text-base font-medium mt-4.5">While using Our Service, we may ask You to provide Us with personally identifiable information including:</p>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>
                        <p className="text-base font-medium">Email address</p>
                    </li>
                    <li>
                        <p className="text-base font-medium">First and last name</p>
                    </li>
                    <li>
                        <p className="text-base font-medium">Phone number</p>
                    </li>
                    <li>
                        <p className="text-base font-medium">Address, State, Province, ZIP/Postal code, City</p>
                    </li>
                    {/* <li>
                        <p className="text-base font-medium">Usage Data</p>
                    </li> */}
                </ul>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">Usage Data</h4>
                <p className="text-base font-medium mt-4.5">
                    Usage Data is collected automatically when using the Service. It may include Your IP address, browser type and version, pages visited, time spent on pages, device identifiers, etc.
                </p>
                <p className="text-base font-medium mt-4.5">
                    When You access the Service by mobile device, We may collect information such as device type, mobile ID, IP address, operating system, and mobile browser type.
                </p>
                <p className="text-base font-medium mt-4.5">
                    Information from Third-Party Social Media Services
                </p>
                <p className="text-base font-medium mt-4.5">
                    We allow you to create an account via:
                </p>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>Google</li>
                    <li>Facebook</li>
                    <li>Apple Account</li>

                </ul>
                <p className="text-base font-medium mt-4.5">
                    We may collect personal data associated with those accounts (name, email, contact list).
                </p>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">Information Collected while Using the Application</h4>
                <p className="text-base font-medium mt-4.5">
                    Upon your permission:
                </p>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>Location data</li>
                    <li>Camera and photo gallery access</li>
                </ul>
                <p className="text-base font-medium mt-4.5">
                    This is used to customize your experience. You can enable/disable this in your device settings.
                </p>
                <p className="text-base font-medium mt-4.5">
                    Tracking Technologies and Cookies
                </p>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">
                    We use Cookies and similar tracking technologies like:
                </h4>

                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>Session Cookies (essential for Service operations)</li>
                    <li>Persistent Cookies (for preferences and login)</li>
                    <li>Web Beacons (for email open tracking and usage statistics)</li>
                </ul>

                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">
                    Use of Your Personal Data
                </h4>
                <p className="text-base font-medium mt-4.5">
                    Personal Data is used to:
                </p>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>Provide and maintain the Service</li>
                    <li>Manage your Account</li>
                    <li>Perform contracts</li>
                    <li>Contact you</li>
                    <li> Provide offers and news</li>
                    <li>Manage your requests</li>
                    <li>Conduct business transfers</li>
                    <li>Analyze and improve Service and marketing</li>

                </ul>

                <p className="text-base font-medium mt-4.5">
                    Personal Data may be shared with Service Providers, Affiliates, Business Partners, and under business transfers or mergers.
                </p>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">
                    Retention of Your Personal Data
                </h4>
                <p className="text-base font-medium mt-4.5">
                    We retain Personal Data only as long as necessary to fulfill purposes, legal obligations, dispute resolution, and policy enforcement.
                </p>

                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">Transfer of Your Personal Data</h4>
                <p className="text-base font-medium mt-4.5">
                    Your data may be transferred and stored outside Your jurisdiction but only with appropriate security safeguards.
                </p>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">
                    Delete Your Personal Data
                </h4>
                <p className="text-base font-medium mt-4.5">
                    You can delete your data via account settings or by contacting Us. However, some data may be retained for legal reasons.
                </p>
                <h4 className="text-xl text-black dark:text-white font-semibold mt-5">
                    Disclosure of Your Personal Data
                </h4>
                <p className="text-base font-medium mt-4.5">
                    Data may be disclosed:
                </p>

                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li> During business transactions (merger or sale)</li>
                    <li>To law enforcement upon valid request</li>
                    <li>To protect the rights, safety, and property of the Company, users, or the public</li>
                </ul>
                <h5 className="text-[18px] text-black dark:text-white font-semibold mt-5">
                    Security of Your Personal Data
                </h5>
                <p className="text-base font-medium mt-4.5">
                    We implement security safeguards but cannot guarantee 100% security of your data.
                </p>
                <h5 className="text-[18px] text-black dark:text-white font-semibold mt-5">
                    Children's Privacy
                </h5>
                <p className="text-base font-medium mt-4.5">
                    The Service does not target anyone under the age of 17. If collected without parental consent, the data will be deleted.
                </p>

                <h5 className="text-[18px] text-black dark:text-white font-semibold mt-5">
                    Hotel Media Terms and Conditions for Users
                </h5>
                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>Data Loss for Free Users: No backup guarantee for free users.</li>
                    <li>Content Moderation: Content from free users may be removed for inaccuracies or harm.</li>
                    <li>Data Sharing with Authorities: Upon legal request.</li>
                    <li>Account Deletion and Data Retention: 30-day retention post-deletion.</li>
                    <li>Premium Account Refund Policy: 15-day refund window for new premium accounts.</li>
                    <li>Refund Processing: Refunds are issued only after confirmed payment.</li>
                    <li>Service Liability Disclaimer: No liability for disputes between users and properties.</li>
                    <li>Booking Charges: Directly paid to properties; Hotel Media charges monthly fees.</li>
                    <li>Recurring Payments: Applicable for premium accounts.</li>
                    <li>Account Closure Policy: No refund upon voluntary closure; service ends after the month.</li>
                </ul>

                <h5 className="text-[18px] text-black dark:text-white font-semibold mt-4">
                    Links to Other Websites
                </h5>
                <p className="text-base font-medium mt-4.5">
                    We are not responsible for the privacy practices of third-party websites linked through our Service.
                </p>
                <h5 className="text-[18px] text-black dark:text-white font-semibold mt-4">
                    Changes to this Privacy Policy
                </h5>
                <p className="text-base font-medium mt-4.5">
                    Changes will be posted here. We will notify you via email or notification before changes become effective.
                </p>

                <ul className="list-disc ms-8 flex flex-col gap-4 mt-5">
                    <li>
                        <p className="text-base font-medium">Email: <a className="font-medium text-primary underline" href={`mailto:${AppConfig.COMPANY_EMAIL}`}>contact@thehotelmedia.com</a></p>
                    </li>
                    <li>
                        <p className="text-base font-medium">Website: <a className="font-medium text-primary underline" href="https://thehotelmedia.com/" rel="external nofollow noopener" target="_blank">https://thehotelmedia.com</a></p>
                    </li>
                    <li>
                        <p className="text-base font-medium">Phone:  <a className="font-medium text-primary underline" href={`tel:${AppConfig.COMPANY_PHONE_NUMBER}`}>{AppConfig.COMPANY_PHONE_NUMBER}</a></p>
                    </li>
                </ul>
            </div>
        </div>
    )
}