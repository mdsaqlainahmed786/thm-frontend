"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBookings } from "@/api-services/booking";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loading from "@/components/Loading";
import moment from "moment";
import Button from "@/components/Button";
import { DefaultPlaceholderImage } from "@/components/Layouts/Placeholder";
import Image from "next/image";
import { UserDetailedView } from "@/components/Profile";
import { fetchUser } from "@/api-services/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/auth";
import Paginator from "@/components/Paginator";
import { useSearchInput } from "@/context/SearchProvider";
const HotelBookings = ({ userID, edit }: { userID: string, edit: boolean }) => {
    const { value } = useSearchInput();
    const route = useRouter();
    const [businessProfileID, setBusinessProfileID] = useState<null | string>(null);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [businessType, setBusinessType] = useState<string | null>('');
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(value);
            setPageNo(1);
        }, 600);
        return () => {
            clearTimeout(timerId);
        };
    }, [value]);
    const { data: hotelData, } = useQuery({
        queryKey: ['hotel-profile', userID],
        queryFn: () => fetchUser(userID),
        placeholderData: keepPreviousData,
    });
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['bookings', businessProfileID, pageNo, debouncedTerm],
        queryFn: () => fetchBookings({
            businessProfileID: businessProfileID,
            query: debouncedTerm,
            documentLimit: 20,
            pageNumber: pageNo,
            status: 'all'
        }, Role.ADMIN),
        placeholderData: keepPreviousData,
    });
    useEffect(() => {
        if (hotelData && hotelData.businessProfileID) {
            setBusinessProfileID(hotelData.businessProfileID);
            setBusinessType(hotelData.businessProfileRef?.businessTypeRef?.name ?? '');
        }
    }, [hotelData]);

    useEffect(() => {
        if (data) {
            setTotalResources(data?.totalResources ?? 0);
            setTotalPages(data?.totalPages ?? 0);
        }
    }, [data]);
    return (
        <div className="h-full">
            <Breadcrumb pageName="Bookings" />
            <div className="flex flex-col gap-4">
                <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className="flex justify-between">
                        <UserDetailedView
                            id={(hotelData && hotelData._id) ?? "6732d3280b82b6c62ea51acc"}
                            name={(hotelData && hotelData.name) ?? "N/A"}
                            username={(hotelData && hotelData.username) ?? "N/A"}
                            accountType={(hotelData && hotelData.accountType) ?? "N/A"}
                            image={hotelData && hotelData.accountType === "business" ?
                                (hotelData.businessProfileRef?.profilePic?.small ? hotelData.businessProfileRef?.profilePic?.small : undefined) :
                                (hotelData?.profilePic?.small ? hotelData?.profilePic?.small : undefined)}
                        />
                        <div>
                            <h5 className="font-semibold text-black dark:text-white">
                                {hotelData && hotelData.businessProfileRef &&
                                    hotelData.businessProfileRef.businessTypeRef &&
                                    hotelData.businessProfileRef.businessTypeRef.name}
                            </h5>
                            <p className="text-xs text-black dark:text-white mb-1">
                                {hotelData && hotelData.businessProfileRef &&
                                    hotelData.businessProfileRef.businessSubtypeRef &&
                                    hotelData.businessProfileRef.businessSubtypeRef.name}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-7">
                    <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <div className="mb-6 flex justify-between">
                            {/*  <div className="">
                            </div>
                            <div className="flex items-center">
                              <button type="button" onClick={(e) => setApiParams({ ...apiParams, postType: '' })} className={`${apiParams.postType === '' ? 'border-primary bg-primary text-white ' : ' border-stroke'}  border inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
                                    All
                                </button>
                                <button type="button" onClick={(e) => setApiParams({ ...apiParams, postType: 'post' })} className={`${apiParams.postType === 'post' ? 'border-primary bg-primary text-white ' : ' border-stroke'} border-y inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
                                    Post
                                </button>
                                <button type="button" onClick={(e) => setApiParams({ ...apiParams, postType: 'event' })} className={`${apiParams.postType === 'event' ? 'border-primary bg-primary text-white ' : ' border-stroke'} border inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
                                    Event
                                </button>
                                <button type="button" onClick={(e) => setApiParams({ ...apiParams, postType: 'review' })} className={`${apiParams.postType === 'review' ? 'border-primary bg-primary text-white ' : ' border-stroke'} border-s-0 border inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
                                    Review
                                </button>
                            </div> */}
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                            User
                                        </th>
                                        <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                            Guest Name
                                        </th>
                                        <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                            Check In
                                        </th>
                                        <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                            Check Out
                                        </th>
                                        {
                                            businessType === "Hotel" || businessType === "Home Stays" ?
                                                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                                    Room Details
                                                </th> :
                                                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                                    Service Details
                                                </th>
                                        }
                                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                            Status
                                        </th>
                                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                            Created
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
                                                <td colSpan={7}>
                                                    <Loading />
                                                </td>
                                            </tr> :
                                            <>
                                                {data && data.data.map((data, key) => {
                                                    // const eventStartTime = data.startDate && data.startDate && data.startTime && data.startTime ? `${data.startDate}T${data.startTime}` : '';
                                                    // const eventEndTime = data.endDate && data.endDate && data.endTime && data.endTime ? `${data.endDate}T${data.endTime}` : '';
                                                    const currentDate = new Date();
                                                    return (
                                                        <tr key={key}>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 max-w-70 ">
                                                                <UserDetailedView
                                                                    id={(data && data.usersRef && data.usersRef._id) ?? "6732d3280b82b6c62ea51acc"}
                                                                    name={(data && data.usersRef && data.usersRef.name) ?? "N/A"}
                                                                    username={(data && data.usersRef && data.usersRef.username) ?? "N/A"}
                                                                    accountType={(data && data.usersRef && data.usersRef.accountType) ?? "N/A"}
                                                                    image={data && data.usersRef && data.usersRef.accountType === "business" ?
                                                                        (data.usersRef.businessProfileRef?.profilePic?.small ? data.usersRef.businessProfileRef?.profilePic?.small : undefined) :
                                                                        (data.usersRef?.profilePic?.small ? data.usersRef?.profilePic?.small : undefined)}
                                                                />
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 max-w-70 ">
                                                                <h5><span className="text-sm font-bold tracking-wide capitalize text-meta-4" title="Booking ID">#{data.bookingID}</span><br />
                                                                    {/* <span className="text-xs capitalize font-semibold" title="Razorpay Order Id"> Razorpay:: GPA.3321-2161-5687-29531..5 </span> */}
                                                                    <br />
                                                                    <span className="text-xs capitalize font-normal" title="Database ID"> DB:: {data._id}</span></h5>
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                                <p className="text-xs font-semibold">
                                                                    {moment(data.checkIn).format('ddd DD, MMM YYYY')}
                                                                </p>
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                                <p className="text-xs font-semibold">
                                                                    {moment(data.checkOut).format('ddd DD, MMM YYYY')}
                                                                </p>
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                                {

                                                                    businessType === "Hotel" || businessType === "Home Stays" ?
                                                                        <>
                                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                                                <div>
                                                                                    <div className="h-8 w-12 rounded-sm bg-stroke flex justify-center items-center">
                                                                                        <Image src={
                                                                                            data?.roomsRef && data?.roomsRef.roomImagesRef.length > 0 ?
                                                                                                data?.roomsRef.roomImagesRef[0].thumbnailUrl :
                                                                                                DefaultPlaceholderImage} alt={""} width={60} height={60} className="w-12 h-8 object-cover" />
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-semibold text-black dark:text-white capitalize">
                                                                                        {data.roomsRef && data.roomsRef.title}
                                                                                        <small className="text-xs ms-1 ">
                                                                                            ({data.roomsRef && data.roomsRef.roomType})
                                                                                        </small>
                                                                                    </h5>
                                                                                    <p className="text-xs text-black/60 dark:text-white mb-1 capitalize">
                                                                                        Bed Size: <b>{data.roomsRef && data.roomsRef.bedType}</b>
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                        :

                                                                        businessType === "Marriage Banquets" ?
                                                                            <div className="flex flex-col gap-2 ">
                                                                                <p className="text-xs text-black/60 dark:text-white mb-1 capitalize">
                                                                                    Type Of Event: <b>{data?.metadata && data.metadata?.typeOfEvent}</b>
                                                                                </p>
                                                                                <p className="text-xs text-black/60 dark:text-white mb-1 capitalize">
                                                                                    Number of Guests: <b>{data.adults && data.adults}</b>
                                                                                </p>
                                                                            </div>
                                                                            :
                                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                                                <div>
                                                                                    <p className="text-xs text-black/60 dark:text-white mb-1 capitalize">
                                                                                        Number of Guests: <b>{data.adults && data.adults}</b>
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                }
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                                {data.status === "confirmed" ?
                                                                    <span className="text-meta-3 text-xs font-bold tracking-wide dark:text-meta-3">Confirmed</span> :
                                                                    data.status === "pending" ?
                                                                        <span className="text-meta-6 text-xs tracking-wide dark:text-meta-6">Pending</span> :

                                                                        data.status === "canceled by business" ?
                                                                            <span className="text-meta-1 text-xs tracking-wide dark:text-meta-1">Canceled By Business</span> :
                                                                            data.status === "created" ?
                                                                                <span className="text-meta-10 text-xs tracking-wide dark:text-meta-10">Created</span> :
                                                                                <span className="text-meta-4 text-xs tracking-wide dark:text-meta-9">{data.status}</span>
                                                                }
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                                <p className="text-black dark:text-white text-xs font-semibold">
                                                                    {moment(data.createdAt).format('ddd DD, MMM YYYY hh:mm:ss A')}
                                                                </p>
                                                                <p className="text-xs font-medium">
                                                                    {moment(data.createdAt).fromNow()}
                                                                </p>
                                                            </td>
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                                <div className="flex items-center space-x-3.5">
                                                                    {/* <Button.Delete onClick={() => {
                                                    performDelete(data._id);
                                                }} />
                                                <button className="hover:text-primary" disabled={data.mediaRef && data.mediaRef.length === 0} onClick={() => {
                                                    setMediaModel(true);
                                                    if (data.mediaRef && data.mediaRef) {
                                                        setMedia(data.mediaRef);
                                                    }
                                                }}>
                                                    <svg className={`${data.mediaRef && data.mediaRef.length !== 0 ? 'fill-current' : 'fill-slate-200'}`} width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z" fill=""></path><path fillRule="evenodd" clipRule="evenodd" d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z" fill=""></path>
                                                    </svg>
                                                </button> */}
                                                                    {/* <Button.Edit onClick={() => {
                                                    setID(data._id);
                                                    setModal(true);
                                                    setEditMode(true);
                                                    setFormInputs({
                                                        ...formInputs,
                                                        content: data?.content ?? '',
                                                        postType: data.postType,
                                                        name: data?.name ?? '',
                                                        venue: data?.venue ?? '',
                                                        isPublished: data.isPublished,
                                                        rating: data?.rating ?? 0,
                                                        streamingLink: data.streamingLink ?? '',
                                                        type: data?.type ?? 'offline',
                                                        startDate: data?.startDate ?? '',
                                                        endDate: data?.endDate ?? '',
                                                        startTime: data?.startTime ?? '',
                                                        endTime: data?.endTime ?? ''
                                                    })
                                                }} /> */}
                                                                    <Button.View onClick={() => { route.push(`/booking/${data?._id || ""}`) }} />
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
                    </div >
                </div >
            </div >
        </div >
    );
};

export default HotelBookings;
