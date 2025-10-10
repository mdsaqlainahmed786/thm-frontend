"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBooking } from "@/api-services/booking";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/components/Loading";
import moment from "moment";
import Button from "@/components/Button";
import { DefaultPlaceholderImage } from "@/components/Layouts/Placeholder";
import Image from "next/image";
import { UserDetailedView } from "@/components/Profile";
import { fetchUser } from "@/api-services/user";
import { useEffect, useState } from "react";
const CheckInIcon = () => {
    return (
        <div className="flex justify-center items-center w-10 h-10 border-[1.5px] rounded-full border-black-2">
            <div className="flex justify-center items-center w-8 h-8 bg-[#3B88C3] rounded-full">
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.78125 0.878906V15.1228L11.2188 13.7916V2.21012L6.78125 0.878906ZM3.71875 1.71959V6.71959H4.28125V2.28209H6.21875V1.71959H3.71875ZM11.7806 1.72053L11.7812 1.79162V2.71959H12.2812V1.71959L11.7806 1.72053ZM11.7812 3.28209V3.78209H12.2812V3.28209H11.7812ZM11.7812 4.34459V11.7196H12.2812V4.34459H11.7812ZM7.625 7.25084C7.83209 7.25084 8 7.58662 8 8.00084C8 8.41506 7.83209 8.75084 7.625 8.75084C7.41791 8.75084 7.25 8.41506 7.25 8.00084C7.25 7.58662 7.41791 7.25084 7.625 7.25084ZM3.71875 9.28209V14.0008H4.28125V9.28209H3.71875ZM11.7812 12.2821V12.7196H12.2812V12.2821H11.7812ZM11.7812 13.2821V14.0008H12.2812V13.2821H11.7812ZM1 14.7196V15.2821H6.21875V14.7196H1ZM10.0829 14.7196L8.20788 15.2821H15V14.7196H10.0829Z" fill="white" />
                    <path d="M5.73633 8L4.73631 7V7.60531H3.08889V8.39469H4.73631V9L5.73633 8Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}
const Booking = ({ bookingID, edit }: { bookingID: string, edit: boolean }) => {
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['booking-details'],
        queryFn: () => fetchBooking(bookingID),
        placeholderData: keepPreviousData,
    });
    return (
        <div className="h-full">
            <Breadcrumb pageName="Booking Details" />
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <div className="flex flex-col gap-3 justify-between">
                            <h5 className="text-base font-bold text-black dark:text-white">{data && data.bookingID}</h5>
                            <div className="dark:border-strokedark border border-stroke p-2.5 rounded-sm bg-whiten dark:bg-primary/50">
                                <UserDetailedView
                                    id={(data && data.usersRef && data.usersRef._id) ?? "6732d3280b82b6c62ea51acc"}
                                    name={(data && data.usersRef && data.usersRef.name) ?? "N/A"}
                                    username={(data && data.usersRef && data.usersRef.username) ?? "N/A"}
                                    accountType={(data && data.usersRef && data.usersRef.accountType) ?? "N/A"}
                                    image={data && data.usersRef && data.usersRef.accountType === "business" ?
                                        (data.usersRef.businessProfileRef?.profilePic?.small ? data.usersRef.businessProfileRef?.profilePic?.small : undefined) :
                                        (data && data.usersRef?.profilePic?.small ? data.usersRef?.profilePic?.small : undefined)}
                                />
                            </div>

                            <div className="flex flex-col gap-2 dark:border-strokedark border border-stroke p-2.5 rounded-sm bg-whiten/50 dark:bg-black/10">
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal">
                                        Room type :
                                    </p>
                                    <p className="text-base font-normal capitalize text-black dark:text-white">
                                        {(data && data.roomsRef && data.roomsRef.roomType) || 0} Room
                                    </p>

                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal">
                                        Guests :
                                    </p>
                                    <p className="text-base font-normal capitalize text-black dark:text-white">
                                        {(data && data.adults) || 0}
                                    </p>

                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal">
                                        Child :
                                    </p>
                                    <p className="text-base font-normal capitalize text-black dark:text-white">
                                        {(data && data.children) || 0} ({data && data.childrenAge.map((data) => (`${data} years`)).join(", ")})
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between gap-2 dark:border-strokedark border border-stroke p-2.5 rounded-sm bg-whiten/50 dark:bg-black/10">
                                <div className="flex gap-2">
                                    <CheckInIcon />
                                    <div>
                                        <p className="text-sm font-normal">
                                            Check-in :
                                        </p>
                                        <p className="text-sm font-normal text-primary">
                                            {moment(data && data.checkIn).format("DD MMM, YYYY")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <CheckInIcon />
                                    <div>
                                        <p className="text-sm font-normal">
                                            Check-out :
                                        </p>
                                        <p className="text-sm font-normal text-primary">
                                            {moment(data && data.checkOut).format("DD MMM, YYYY")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <h5 className="mb-4 text-base font-bold text-black dark:text-white">Guest Details</h5>
                        <div className="flex flex-col gap-4">
                            {
                                data && data.guestDetails.map((guestDetail, index) => {
                                    return (
                                        <div key={index} className="flex justify-between">
                                            <p className="text-sm font-normal">
                                                Guest {++index}:
                                            </p>
                                            <p className="text-base font-normal capitalize text-black dark:text-white">
                                                {guestDetail && guestDetail.fullName}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                            <div className="flex justify-between">
                                <p className="text-sm font-normal">
                                    Phone Number :
                                </p>
                                <p className="text-base font-normal  text-black dark:text-white">
                                    {data && data.guestDetails && data.guestDetails.length !== 0 ?

                                        data && data.guestDetails && data.guestDetails[0].mobileNumber : ""
                                    }
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm font-normal">
                                    Email :
                                </p>
                                <p className="text-base font-normal text-black dark:text-white">
                                    {data && data.guestDetails && data.guestDetails.length !== 0 ?

                                        data && data.guestDetails && data.guestDetails[0].email : ""
                                    }
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm font-normal">
                                    Address :
                                </p>
                                <p className="text-base font-normal capitalize text-black dark:text-white">
                                    {`${data?.usersRef?.userAddressesRef?.street}, ${data?.usersRef?.userAddressesRef?.city}, ${data?.usersRef?.userAddressesRef?.state} ${data?.usersRef?.userAddressesRef?.zipCode}, ${data?.usersRef?.userAddressesRef?.country}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <h5 className="mb-4 text-base font-bold text-black dark:text-white">Bill Summary</h5>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end">
                                <p className="text-sm font-normal">
                                    {(data && data?.roomsRef?.title) || ""}<br />
                                    <small>{((data && data?.bookedRoom?.nights) ? `${data?.bookedRoom?.nights} Nights` : '')}</small>
                                </p>
                                <p className="text-base font-normal capitalize text-black dark:text-white">
                                    ₹ {(data && data.subTotal) || 0}
                                </p>
                            </div>
                            {
                                (data && data.discount > 0) &&
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-normal">
                                        Promo Code <span className="font-bold ms-1 text-xs">{data && data.promoCode}</span><br />
                                        <small>{data && data.promoCodesRef && data.promoCodesRef.name} </small>
                                    </p>
                                    <p className="text-base font-normal capitalize text-black dark:text-white">
                                        -  ₹ {data.discount}
                                    </p>
                                </div>
                            }
                            <div className="flex justify-between items-end">
                                <p className="text-sm font-normal">
                                    Convince charges
                                </p>
                                <p className="text-base font-normal capitalize text-black dark:text-white">
                                    ₹ {(data && data.convinceCharge) || 0}
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-sm font-normal">
                                    GST(18%)
                                </p>
                                <p className="text-base font-normal capitalize text-black dark:text-white">
                                    ₹ {(data && data.tax) || 0}
                                </p>
                            </div>
                            <div className="border border-dashed"></div>
                            <div className="flex justify-between items-end">
                                <p className="text-sm font-normal">
                                    Total
                                </p>
                                <p className="text-base font-normal capitalize text-black dark:text-white">
                                    ₹ {(data && data.grandTotal) || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className="flex flex-col justify-between gap-3.5">
                        <h5 className="text-base font-bold text-black dark:text-white">General Information</h5>
                        <p className="text-xs font-medium tracking-wide text-black dark:text-white">
                            {(data && data?.roomsRef && data.roomsRef?.description) || ""}
                        </p>
                        <div className="flex gap-3">
                            {
                                data && data?.roomsRef && data.roomsRef?.amenitiesRef && data?.roomsRef.amenitiesRef.map((data) => {
                                    return (
                                        <div className="flex gap-1">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <rect x="0.333333" y="0.333333" width="15.3333" height="15.3333" rx="7.66667" stroke="#4169E1" strokeOpacity="0.666667" />
                                                    <path d="M11.5984 5L6.55844 11L4.39844 8.6" stroke="#4169E1" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium tracking-wide text-black dark:text-white">
                                                {(data && data.name) || ""}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-7">
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <div className="flex flex-col justify-between gap-3.5">
                            <h5 className="text-base font-bold text-black dark:text-white">Property Images</h5>
                            <div className="flex gap-3 mb-3.5">
                                {data && data?.roomsRef && data?.roomsRef?.roomImagesRef && data?.roomsRef?.roomImagesRef.map((roomImage, index) => {
                                    return (
                                        <Image key={index} src={roomImage.thumbnailUrl || DefaultPlaceholderImage} width={120} height={120} alt="Room Image" className="w-30 h-auto object-cover rounded-sm" />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
