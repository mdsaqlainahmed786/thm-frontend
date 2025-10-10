import React from "react";
import Link from "next/link";
import Button from "./Button";
const DownloadApp: React.FC<{}> = () => {
    return (
        <main className="fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
            <div className="relative w-full max-w-142.5 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-8 py-12 text-center md:px-17.5 md:py-15">
                <span className="mx-auto inline-block">
                    <img alt="Logo" fetchPriority="high" width="100" height="100" decoding="async" data-nimg="1" className="" src="/images/logo/logo.svg" style={{ color: "transparent" }} />
                </span>
                <h3 className="mt-5.5 pb-2 text-xl font-bold text-white sm:text-4xl">Download App!</h3>
                <p className="text-sm font-quicksand">Search Hotels, Rate and Review</p>
                <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                {/* <p className="mb-7.5 text-white">Our website is currently under construction.</p> */}
                <div className="flex justify-center items-center gap-3">
                    <Button.AppStore />
                    <Button.PlayStore />
                </div>
                <Link href={'/'} className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-primary">
                    <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z" className="fill-current stroke-current"></path>
                    </svg>
                </Link>
            </div>
        </main>
    );
};

export default DownloadApp;