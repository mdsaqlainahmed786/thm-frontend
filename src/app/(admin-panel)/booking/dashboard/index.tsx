"use client";
import React from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import toast from "react-hot-toast";
import { handleClientApiErrors } from "@/api-services/api-errors";
import Link from "next/link";
import { BookingStatistics, Statistics } from "@/types/dashboard";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import AllBookings from "..";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const options: ApexOptions = {
    chart: {
        fontFamily: "Satoshi, sans-serif",
        type: "donut",
    },
    colors: ["#3C50E0", "#0FADCF", "#FF6384"],
    labels: ["Users", "Posts", "Comments"],
    legend: {
        show: false,
        position: "bottom",
    },

    plotOptions: {
        pie: {
            donut: {
                size: "65%",
                background: "transparent",
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 2600,
            options: {
                chart: {
                    width: 380,
                },
            },
        },
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200,
                },
            },
        },
    ],
};
const BookingDashboard: React.FC<{}> = () => {
    const fetchDashboard = async () => {
        try {
            const response = await apiRequest.get(`/admin/bookings/statistical`);
            if (response.status === 200 && response.data.status) {
                const responseData = response.data.data;
                return responseData as BookingStatistics;
            } else {
                toast.error("Something went wrong");
                return null;
            }
        } catch (error) {
            handleClientApiErrors(error)
            return null;
        }
    }
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => fetchDashboard(),
        placeholderData: keepPreviousData,
    });
    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">Overview</h2>
                <nav>
                    <ol className="flex items-center gap-2">
                        <li><a className="font-medium" href="/">Dashboard /</a></li>
                        <li className="font-medium text-primary">Booking</li>
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5" >
                <CardDataStats loading={isFetching} title="Total Bookings" total={data?.totalBookings?.toString() || "0"} >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="18"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                            fill=""
                        />
                        <path
                            d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                            fill=""
                        />
                        <path d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                            fill="" />
                    </svg>
                </CardDataStats>
                <CardDataStats loading={isFetching} title="Confirmed Booking" total={data?.confirmedBookings?.toString() || "0"} >
                    <svg className="fill-primary dark:fill-white" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2875 0.506226H2.7125C1.75625 0.506226 0.96875 1.29373 0.96875 2.24998V15.75C0.96875 16.7062 1.75625 17.5219 2.74063 17.5219H13.3156C14.2719 17.5219 15.0875 16.7344 15.0875 15.75V2.24998C15.0313 1.29373 14.2438 0.506226 13.2875 0.506226ZM13.7656 15.75C13.7656 16.0312 13.5406 16.2562 13.2594 16.2562H2.7125C2.43125 16.2562 2.20625 16.0312 2.20625 15.75V2.24998C2.20625 1.96873 2.43125 1.74373 2.7125 1.74373H13.2875C13.5688 1.74373 13.7938 1.96873 13.7938 2.24998V15.75H13.7656Z" fill=""></path><path d="M11.7965 2.6156H8.73086C8.22461 2.6156 7.80273 3.03748 7.80273 3.54373V7.25623C7.80273 7.76248 8.22461 8.18435 8.73086 8.18435H11.7965C12.3027 8.18435 12.7246 7.76248 12.7246 7.25623V3.5156C12.6965 3.03748 12.3027 2.6156 11.7965 2.6156ZM11.4309 6.8906H9.06836V3.88123H11.4309V6.8906Z" fill=""></path><path d="M3.97773 4.35938H6.03086C6.36836 4.35938 6.67773 4.07812 6.67773 3.7125C6.67773 3.34687 6.39648 3.09375 6.03086 3.09375H3.94961C3.61211 3.09375 3.30273 3.375 3.30273 3.74063C3.30273 4.10625 3.61211 4.35938 3.97773 4.35938Z" fill=""></path><path d="M3.97773 7.9312H6.03086C6.36836 7.9312 6.67773 7.64995 6.67773 7.28433C6.67773 6.9187 6.39648 6.63745 6.03086 6.63745H3.94961C3.61211 6.63745 3.30273 6.9187 3.30273 7.28433C3.30273 7.64995 3.61211 7.9312 3.97773 7.9312Z" fill=""></path><path d="M12.0789 10.2374H3.97891C3.64141 10.2374 3.33203 10.5187 3.33203 10.8843C3.33203 11.2499 3.61328 11.5312 3.97891 11.5312H12.0789C12.4164 11.5312 12.7258 11.2499 12.7258 10.8843C12.7258 10.5187 12.4164 10.2374 12.0789 10.2374Z" fill=""></path><path d="M12.0789 13.8093H3.97891C3.64141 13.8093 3.33203 14.0906 3.33203 14.4562C3.33203 14.8218 3.61328 15.1031 3.97891 15.1031H12.0789C12.4164 15.1031 12.7258 14.8218 12.7258 14.4562C12.7258 14.0906 12.4164 13.8093 12.0789 13.8093Z" fill=""></path></svg>
                </CardDataStats>
                <CardDataStats loading={isFetching} title="Canceled Bookings" total={data?.cancelledBookings?.toString() || "0"}   >
                    <svg width="22" height="22" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.83948 1.52028C8.68581 1.5125 9.53181 1.5215 10.3775 1.54728C11.1618 1.68955 11.6688 2.14254 11.8985 2.90628C11.9284 3.05513 11.9494 3.20514 11.9615 3.35628C11.9211 3.68855 11.7351 3.82954 11.4035 3.77928C11.268 3.74618 11.175 3.66518 11.1245 3.53628C11.1194 3.27865 11.0534 3.03866 10.9265 2.81628C10.7445 2.57078 10.5015 2.42979 10.1975 2.39328C9.39348 2.38128 8.58949 2.38128 7.78548 2.39328C7.1849 2.50445 6.88188 2.86746 6.87648 3.48228C6.7797 3.73328 6.59669 3.83228 6.32748 3.77928C6.13564 3.70503 6.03365 3.56404 6.02148 3.35628C6.08398 2.45099 6.54599 1.86 7.40748 1.58328C7.55305 1.5545 7.69705 1.5335 7.83948 1.52028Z" className="fill-primary stroke-primary dark:fill-white dark:stroke-white" stroke="black" strokeWidth="0.25" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.14126 4.34683C7.04127 4.34382 10.9413 4.34683 14.8413 4.35583C15.6173 4.48125 16.1303 4.91626 16.3803 5.66083C16.4237 5.81379 16.4478 5.9698 16.4523 6.12883C16.4697 6.98741 16.4637 7.8454 16.4343 8.70283C16.3919 8.79927 16.3289 8.88027 16.2453 8.94583C12.9743 10.8497 9.48831 11.3957 5.78726 10.5838C4.35325 10.2419 3.00325 9.69591 1.73726 8.94583C1.65362 8.88027 1.59062 8.79927 1.54826 8.70283C1.51879 7.8454 1.51279 6.98741 1.53026 6.12883C1.62465 5.13158 2.16165 4.53758 3.14126 4.34683ZM3.19526 5.21083C7.08988 5.20192 10.9839 5.21092 14.8773 5.23783C15.2513 5.35391 15.4823 5.60291 15.5703 5.98483C15.5996 6.76432 15.6056 7.54431 15.5883 8.32483C12.4577 10.0763 9.14874 10.5233 5.66126 9.66583C4.51129 9.36529 3.42229 8.91829 2.39426 8.32483C2.38225 7.58683 2.38225 6.84883 2.39426 6.11083C2.45658 5.62566 2.72357 5.32565 3.19526 5.21083Z" className="fill-primary stroke-primary dark:fill-white dark:stroke-white" stroke="black" strokeWidth="0.25" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.84514 10.2503C2.10603 10.2112 2.28303 10.3132 2.37614 10.5563C2.38214 11.9303 2.38815 13.3043 2.39414 14.6783C2.46915 15.2093 2.77214 15.5123 3.30314 15.5873C7.09515 15.5993 10.8871 15.5993 14.6791 15.5873C15.1479 15.5326 15.4449 15.2776 15.5701 14.8223C15.5937 13.4008 15.6057 11.9788 15.6061 10.5563C15.7152 10.2873 15.9102 10.1944 16.1911 10.2773C16.348 10.3503 16.435 10.4733 16.4521 10.6463C16.4641 11.9843 16.4641 13.3223 16.4521 14.6603C16.4036 15.4268 16.0346 15.9758 15.3451 16.3073C15.1942 16.3677 15.0382 16.4097 14.8771 16.4333C11.0314 16.4631 7.18538 16.4691 3.33914 16.4513C2.56541 16.4082 2.01042 16.0392 1.67414 15.3443C1.61755 15.1985 1.57555 15.0485 1.54814 14.8943C1.51884 13.4786 1.51284 12.0626 1.53014 10.6463C1.55432 10.4471 1.65932 10.3151 1.84514 10.2503Z" className="fill-primary stroke-primary dark:fill-white dark:stroke-white" stroke="black" strokeWidth="0.25" />
                    </svg>
                </CardDataStats>
                <CardDataStats loading={isFetching} title="Waiting for response" total={data?.pendingBookings?.toString() || "0"}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-primary dark:fill-white"><g clipPath="url(#clip0_608_18010)"><path d="M22.1991 0.0314941H11.2074C10.5205 0.0314941 9.94196 0.610005 9.94196 1.29699V5.8166H1.58971C0.902729 5.8166 0.324219 6.39511 0.324219 7.08209V16.6275C0.324219 17.0976 0.505003 17.6761 0.902729 17.9653L5.63928 22.5934C6.03701 22.9911 6.50705 23.1719 6.97709 23.1719H12.5814C13.2684 23.1719 13.8469 22.5934 13.8469 21.9064V15.362L15.3293 16.8445C15.7271 17.2422 16.1971 17.423 16.6671 17.423H22.2715C22.9584 17.423 23.537 16.8445 23.537 16.1575V1.29699C23.4646 0.610005 22.8861 0.0314941 22.1991 0.0314941ZM3.03599 17.3868H6.10932V20.3878L3.03599 17.3868ZM11.8944 21.2556H8.02564V16.6998C8.02564 16.0128 7.44713 15.4343 6.76015 15.4343H2.24053V7.73291H11.8944V21.2556ZM13.8107 12.7587V12.5779H14.787V13.6265L13.8107 12.7587ZM21.5483 15.4705H16.7033V11.891C16.7033 11.204 16.1248 10.6255 15.4378 10.6255H13.8107V7.04593C13.8107 6.35895 13.2322 5.78044 12.5453 5.78044H11.8944V1.94781H21.5483V15.4705Z" fill=""></path></g><defs><clipPath id="clip0_608_18010"><rect width="23.1404" height="23.1404" fill="white" transform="translate(0.324219 0.0314941)"></rect></clipPath></defs></svg>
                </CardDataStats>
            </div >
            <div className="mt-4 md:mt-6 2xl:mt-7.5 ">
                <div className="col-span-12 xl:col-span-7">
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <div className="mb-6 flex justify-between">
                            <div>
                                <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                                    All Hotel Bookings
                                </h4>
                            </div>
                        </div>
                        <AllBookings />
                    </div >
                </div>
            </div >
        </>
    )
}
interface CardDataStatsProps {
    loading: boolean;
    title: string;
    total: string;
    children: React.ReactNode;
}
const CardDataStats: React.FC<CardDataStatsProps> = ({
    loading,
    title,
    total,
    children,
}) => {
    return (
        <div className={`rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark ${loading ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    {children}
                </div>
                <div>
                    {loading ?
                        <div className="w-40 h-7 bg-gray-200 dark:bg-gray-700 mx-auto mb-3 rounded-md"></div>
                        :
                        <h4 className="text-title-md font-bold text-black dark:text-white">
                            {total}
                        </h4>
                    }
                    <span className="text-sm font-medium">{title}</span>
                </div>

            </div>
        </div>
    );
};

export default BookingDashboard;