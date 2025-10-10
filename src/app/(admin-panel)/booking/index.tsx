"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import { SubscriptionPlans } from "@/types/subscription-plans";
import swal from "sweetalert";
import { MinusIcon, PlusIcon, ListIcon, DownArrowIcon } from "@/components/Icons";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchBusinessSubtypes, fetchBusinessTypes } from "@/api-services/business";
import { Subscription } from "@/types/subscription";
import { fetchPosts } from "@/api-services/post";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { MediaRef } from "@/types/post";
import Link from "next/link";
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { UserDetailedView } from "@/components/Profile";
import Loading from "@/components/Loading";
import { hotelBookingsStatistical } from "@/api-services/booking";
const AllBookings = () => {
    const route = useRouter();
    const { value } = useSearchInput();
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const initialApiParams = {
        postType: '',
    }
    const [apiParams, setApiParams] = useState(initialApiParams);
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(value);
            setPageNo(1);
        }, 600);
        return () => {
            clearTimeout(timerId);
        };
    }, [value]);


    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['posts', debouncedTerm, pageNo, apiParams],
        queryFn: () => hotelBookingsStatistical(),
        placeholderData: keepPreviousData,
    });
    useEffect(() => {
        setPageNo(1);
    }, [apiParams.postType])
    useEffect(() => {
        if (data) {
            setTotalResources(data?.totalResources ?? 0);
            setTotalPages(data?.totalPages ?? 0);
        }
    }, [data]);
    return (
        <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-50 px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                            Business Details
                        </th>
                        <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white text-center">
                            Total Bookings
                        </th>
                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white text-center">
                            Confirm Bookings
                        </th>
                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white text-center">
                            Cancel Bookings
                        </th>
                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white text-center">
                            Waiting
                        </th>
                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isFetching ?
                            <tr>
                                <td colSpan={["review", "event"].includes(apiParams.postType) ? 7 : 6}>
                                    <Loading />
                                </td>
                            </tr> :
                            <>
                                {data && data.data.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 max-w-70 ">
                                                <div className="flex flex-col gap-0.5">
                                                    <UserDetailedView
                                                        id={data && data.businessProfileRef.userID}
                                                        name={data && data.businessProfileRef.name}
                                                        username={data && data.businessProfileRef.username}
                                                        accountType={'business'}
                                                        image={(data && data.businessProfileRef.profilePic && data.businessProfileRef.profilePic.small) ? data.businessProfileRef.profilePic.small : undefined}
                                                    />
                                                    <div className="flex gap-2 mx-16">
                                                        <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                            {data && data.businessProfileRef && data.businessProfileRef.businessTypeRef && data && data.businessProfileRef.businessTypeRef.name} -                                                                    {data && data.businessProfileRef && data.businessProfileRef.businessSubtypeRef && data && data.businessProfileRef.businessSubtypeRef.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                    {data.totalBookings || 0}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">

                                                <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                    {data.confirmedBookings || 0}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                    {data.cancelledBookings || 0}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                    {data.pendingBookings || 0}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <Button.View onClick={() => { route.push(`/booking/hotels/${data?.businessProfileRef?.userID || ""}`) }} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </>
                    }
                </tbody>
            </table>
            <Paginator pageNo={pageNo} totalPages={totalPages} totalResources={totalResources} onPageChange={(e, pageNo) => setPageNo(pageNo)} />
        </div>
    );
};



export default AllBookings;
