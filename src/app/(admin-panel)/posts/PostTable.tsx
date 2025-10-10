"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import swal from "sweetalert";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchPosts } from "@/api-services/post";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { Swiper, SwiperSlide } from 'swiper/react';
import { MediaRef } from "@/types/post";
import Link from "next/link";
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { UserDetailedView } from "@/components/Profile";
import Loading from "@/components/Loading";
const PostTable = () => {
    const initialInputs = {
        content: '',
        postType: '',
        name: '',
        venue: '',
        isPublished: false,
        canPublished: true,
        rating: 0,
        type: 'offline',
        streamingLink: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    };
    const [media, setMedia] = useState<MediaRef[]>([]);
    const { value } = useSearchInput();
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [modal, setModal] = useState(false);
    const [mediaModel, setMediaModel] = useState(false);
    const [formInputs, setFormInputs] = useState(initialInputs);
    const [ID, setID] = useState<string | null>(null);
    const [isEditMode, setEditMode] = useState(false);
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
        queryFn: () => fetchPosts({
            query: debouncedTerm,
            documentLimit: 20,
            pageNumber: pageNo,
            postType: apiParams.postType,
        }),
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
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!formInputs.canPublished) {
                toast.error("This post could not be published");
                return false
            }
            // setButtonLoading(true);
            if (isEditMode) {
                const response = await apiRequest.put(`/admin/posts/${ID}`, formInputs);
                if (response.status === 200 && response.data.statusCode === 202) {
                    toast.success(response?.data?.message);
                    refetch();
                    setModal(false);
                    setFormInputs(initialInputs);
                } else {
                    toast.error(response?.data?.message);
                }
            } else {
                // const response = await apiRequest.post('/admin/subscriptions/plans', { ...formInputs, price: parseFloat(formInputs.price.toString()).toFixed(2) });
                // if (response.status === 200 && response.data.statusCode === 201) {
                //     toast.success(response?.data?.message);
                //     refetch();
                //     setModal(false);
                //     setFormInputs(initialInputs);
                // } else {
                //     toast.error(response?.data?.message);
                // }
            }
        } catch (error: any) {
            console.log("catch :::", error)
            handleClientApiErrors(error);
        } finally {
            // setButtonLoading(false);
        }
    }
    const performDelete = async (id: string) => {
        try {
            const willDelete = await swal({
                title: "Are you sure?",
                text: "Are you sure that you want to delete this item?",
                icon: "warning",
                dangerMode: true,
                buttons: {
                    cancel: true,
                    confirm: true,
                },
            });
            if (willDelete) {
                const response = await apiRequest.delete(`admin/subscriptions/plans/${id}`);
                if (response.status === 200 && response.data.statusCode === 204) {
                    refetch();
                    toast.success(response?.data?.message);
                } else {
                    toast.error(response?.data?.message);
                }
            }
        } catch (error: any) {
            handleClientApiErrors(error);
        } finally {
        }
    }
    useEffect(() => {

    }, [media])
    return (
        <div className="col-span-12 xl:col-span-7">
            <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                <div className="mb-6 flex justify-between">
                    <div>
                        <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                            User Posts
                        </h4>
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
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <div className={`${mediaModel ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
                        <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
                            <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setMediaModel(false)}>
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                                </svg>
                            </button>
                            <div className="flex justify-center">
                                <div className="max-w-100">
                                    <Swiper
                                        slidesPerView={1}
                                        centeredSlides={true}
                                        spaceBetween={20}
                                        pagination={{
                                            type: 'fraction',
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="w-full"
                                    >
                                        {
                                            media && media.map((data, index) => (<SwiperSlide key={index} className="!flex justify-center !bg-black/60 !w-100 !h-100 rounded-lg overflow-hidden relative">
                                                <div className="absolute bg-white/90 right-3.5 top-3.5 rounded-lg w-7 h-7 flex justify-center items-center">
                                                    <Link href={data.sourceUrl} target="_blank">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13.5 10.5L21 3M21 3H16M21 3V8M21 14V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                                {data.mediaType === "image" ? <Image src={data.sourceUrl} width={200} height={200} alt={'media image'} className="w-full h-full" /> : null}
                                                {data.mediaType === "video" ?
                                                    <>
                                                        <video width="320" height="320" controls={true} autoPlay={false} muted={true}>
                                                            <source src={data.sourceUrl} type={data.mimeType ?? "video/mp4"} />
                                                            {/* <source src="movie.ogg" type="video/ogg" /> */}
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </>
                                                    : null}
                                            </SwiperSlide>))
                                        }
                                    </Swiper>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={`${modal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
                        <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
                            <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setModal(false)}>
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                                </svg>
                            </button>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="content" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Content</label>
                                    <textarea name="content" id="content" required={true} cols={30} rows={3} placeholder="Enter content" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.content} onChange={(e) => setFormInputs({ ...formInputs, content: e.target.value })}></textarea>
                                </div>
                                {
                                    formInputs.postType === "event" ?
                                        <>
                                            <div className="mb-3 flex gap-3">
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Event Name</label>
                                                    <input id="name" placeholder="Enter name" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="name" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Event Type</label>
                                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                                        <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                            <ListIcon />
                                                        </span>
                                                        <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} value={formInputs.type}>
                                                            <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                                                            <option value="online" className="text-body dark:text-bodydark">Online</option>
                                                            <option value="offline" className="text-body dark:text-bodydark">Offline</option>
                                                        </select>
                                                        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                            <DownArrowIcon />
                                                        </span>
                                                    </div>
                                                </div>
                                                {
                                                    formInputs.type === "online" ?
                                                        <div className="mb-3">
                                                            <label htmlFor="streamingLink" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Streaming Link</label>
                                                            <input id="streamingLink" placeholder="Enter streaming link" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="streamingLink" value={formInputs.streamingLink} onChange={(e) => setFormInputs({ ...formInputs, streamingLink: e.target.value })} />
                                                        </div>
                                                        : <div className="mb-3">
                                                            <label htmlFor="venue" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Event Venue</label>
                                                            <input id="venue" placeholder="Enter venue" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="venue" value={formInputs.venue} onChange={(e) => setFormInputs({ ...formInputs, venue: e.target.value })} />
                                                        </div>
                                                }
                                            </div>
                                            <div className="mb-3 grid grid-cols-2 gap-3">
                                                <div className="grid grid-cols-2">
                                                    <div >
                                                        <label htmlFor="startDate" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Start Date</label>
                                                        <input id="startDate" placeholder="Enter start date" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="date" name="startDate" value={formInputs.startDate} onChange={(e) => setFormInputs({ ...formInputs, startDate: e.target.value })} />
                                                    </div>
                                                    <div >
                                                        <label htmlFor="startTime" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Start Time</label>
                                                        <input id="startTime" placeholder="Enter start time" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="time" name="startTime" value={formInputs.startTime} onChange={(e) => setFormInputs({ ...formInputs, startTime: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <div >
                                                        <label htmlFor="endDate" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">End Date</label>
                                                        <input id="endDate" placeholder="Enter end date" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="date" name="endDate" value={formInputs.endDate} onChange={(e) => setFormInputs({ ...formInputs, endDate: e.target.value })} min={formInputs.startDate} />
                                                    </div>
                                                    <div >
                                                        <label htmlFor="endTime" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">End Time</label>
                                                        <input id="endTime" placeholder="Enter end time" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="time" name="endTime" value={formInputs.endTime} onChange={(e) => setFormInputs({ ...formInputs, endTime: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </> : formInputs.postType === "review" ?
                                            <div className="mb-3 flex gap-3">
                                                <div className="mb-3">
                                                    <label htmlFor="rating" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Rating</label>
                                                    <input id="rating" placeholder="Enter rating" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="rating" value={formInputs.rating} onChange={(e) => setFormInputs({ ...formInputs, rating: parseInt(e.target.value) })} max={5} min={1} step={1} />
                                                </div>
                                            </div> : null
                                }
                                <div className="mb-3 flex gap-3">
                                    <div >
                                        <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Post Type</label>
                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                <ListIcon />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} disabled={true} onChange={(e) => setFormInputs({ ...formInputs, postType: e.target.value })} value={formInputs.postType}>
                                                <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                                                <option value="post" className="text-body dark:text-bodydark">Post</option>
                                                <option value="review" className="text-body dark:text-bodydark">Review</option>
                                                <option value="event" className="text-body dark:text-bodydark">Event</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="isPublished" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Publish</label>
                                        <div className="pt-3">
                                            <SwitcherThree id="isPublished" enabled={formInputs.isPublished} setEnabled={(e) => setFormInputs({ ...formInputs, isPublished: !formInputs.isPublished })} />
                                        </div>
                                    </div>
                                </div>
                                <button className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4.5 py-2.5 font-medium text-white hover:bg-opacity-90">
                                    {isEditMode ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                    Post Content
                                </th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                    Posted By
                                </th>
                                {
                                    apiParams.postType === 'event' ?
                                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                            Event Details
                                        </th>
                                        : null
                                }
                                {
                                    apiParams.postType === 'review' ?
                                        <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                            Reviewed Business
                                        </th>
                                        : null
                                }
                                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                    Reported Count
                                </th>
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
                                        <td colSpan={["review", "event"].includes(apiParams.postType) ? 7 : 6}>
                                            <Loading />
                                        </td>
                                    </tr> :
                                    <>
                                        {data && data.data.map((data, key) => {
                                            const eventStartTime = data.startDate && data.startDate && data.startTime && data.startTime ? `${data.startDate}T${data.startTime}` : '';
                                            const eventEndTime = data.endDate && data.endDate && data.endTime && data.endTime ? `${data.endDate}T${data.endTime}` : '';
                                            const currentDate = new Date();
                                            return (
                                                <tr key={key}>
                                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 max-w-70 ">
                                                        <h5 className="truncate">
                                                            <span className="text-sm font-bold tracking-wide capitalize text-meta-4 dark:text-meta-9" title="Post Type">
                                                                {data.postType && data.postType}
                                                            </span><br />
                                                            <span className="text-xs capitalize font-semibold" title={data.content && data.content}>{data.content && data.content}</span><br />
                                                            <span className="text-xs capitalize font-normal" title="Feelings">{data.feelings && data.feelings}</span>
                                                            {
                                                                data && data.location ? <>
                                                                    {/* <svg width="24" height="24" viewBox="0 0 24 24" className="fill-meta-4" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12 3.00002C10.1435 3.00002 8.36301 3.73752 7.05025 5.05028C5.7375 6.36303 5 8.14351 5 10C5 12.862 6.782 15.623 8.738 17.762C9.73814 18.8517 10.8294 19.854 12 20.758C12.1747 20.624 12.3797 20.4607 12.615 20.268C13.5548 19.4963 14.4393 18.6596 15.262 17.764C17.218 15.623 19 12.863 19 10C19 8.14351 18.2625 6.36303 16.9497 5.05028C15.637 3.73752 13.8565 3.00002 12 3.00002ZM12 23.214L11.433 22.824L11.43 22.822L11.424 22.817L11.404 22.803L11.329 22.75L11.059 22.553C9.69086 21.5248 8.41988 20.3733 7.262 19.113C5.218 16.875 3 13.636 3 9.99902C3 7.61207 3.94821 5.32289 5.63604 3.63506C7.32387 1.94724 9.61305 0.999023 12 0.999023C14.3869 0.999023 16.6761 1.94724 18.364 3.63506C20.0518 5.32289 21 7.61207 21 9.99902C21 13.636 18.782 16.876 16.738 19.111C15.5804 20.3713 14.3098 21.5228 12.942 22.551C12.8281 22.6361 12.713 22.7198 12.597 22.802L12.576 22.816L12.57 22.821L12.568 22.822L12 23.214ZM12 8.00002C11.4696 8.00002 10.9609 8.21074 10.5858 8.58581C10.2107 8.96088 10 9.46959 10 10C10 10.5305 10.2107 11.0392 10.5858 11.4142C10.9609 11.7893 11.4696 12 12 12C12.5304 12 13.0391 11.7893 13.4142 11.4142C13.7893 11.0392 14 10.5305 14 10C14 9.46959 13.7893 8.96088 13.4142 8.58581C13.0391 8.21074 12.5304 8.00002 12 8.00002ZM8 10C8 8.93916 8.42143 7.92174 9.17157 7.1716C9.92172 6.42145 10.9391 6.00002 12 6.00002C13.0609 6.00002 14.0783 6.42145 14.8284 7.1716C15.5786 7.92174 16 8.93916 16 10C16 11.0609 15.5786 12.0783 14.8284 12.8285C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8285C8.42143 12.0783 8 11.0609 8 10Z" />
                                                                    </svg> {data.location.placeName} */}
                                                                </> : null}
                                                        </h5>
                                                        {
                                                            data.postType === "review" ? (
                                                                <div className="flex gap-1">
                                                                    {Array.from({ length: data.rating ?? 0 }).map((_, index) => (
                                                                        <div key={index}>
                                                                            <svg className="w-5 h-5 fill-meta-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <g clipPath="url(#clip0_771_10385)">
                                                                                    <path d="M12.0001 2L15.1041 8.728L22.4621 9.601L17.0221 14.631L18.4661 21.899L12.0001 18.28L5.53409 21.9L6.97809 14.632L1.53809 9.6L8.89709 8.727L12.0001 2Z" stroke="black" strokeWidth="2.5" strokeLinejoin="round" />
                                                                                </g>
                                                                                <defs>
                                                                                    <clipPath id="clip0_771_10385">
                                                                                        <rect width="24" height="24" fill="white" />
                                                                                    </clipPath>
                                                                                </defs>
                                                                            </svg>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : null
                                                        }
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                        <UserDetailedView
                                                            id={data.postedBy && data.postedBy._id}
                                                            name={data.postedBy && data.postedBy.name}
                                                            username={data.postedBy && data.postedBy.username}
                                                            accountType={data.postedBy && data.postedBy.accountType}
                                                            image={(data.postedBy && data.postedBy.profilePic && data.postedBy.profilePic.small) ? data.postedBy.profilePic.small : undefined}
                                                            register={!data.publicUserID ? false : true}
                                                        />
                                                    </td>
                                                    {
                                                        apiParams.postType === 'event' ?
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                                <div>
                                                                    <h5 className="font-semibold text-black dark:text-white">
                                                                        {(data.name && data.name) ?? ''}
                                                                    </h5>
                                                                    <p className="text-xs text-meta-4 dark:text-white mb-1 capitalize ">
                                                                        {
                                                                            data.type && data.type === "online" ?
                                                                                <>
                                                                                    <b>Online event&nbsp;</b>
                                                                                    {data.streamingLink && data.streamingLink}
                                                                                </> :
                                                                                <>
                                                                                    <b>{data.venue && data.venue} </b>
                                                                                    {data.location && data.location && data.location.placeName}
                                                                                </>
                                                                        }
                                                                    </p>
                                                                    <small className="text-xs capitalize text-black dark:text-white">
                                                                        {eventStartTime ? <> {moment(`${eventStartTime}`).format('ddd DD, MMM YYYY hh:mm:ss A')} </> : ''} -
                                                                        {eventEndTime ? <> {moment(`${eventEndTime}`).format('ddd DD, MMM YYYY hh:mm:ss A')} </> : ''}
                                                                    </small>
                                                                    {
                                                                        (currentDate < new Date(eventStartTime)) || currentDate < new Date(eventEndTime) ?
                                                                            <p className="text-xs capitalize text-meta-3 dark:text-white">Event is coming soon!</p> :
                                                                            (currentDate > new Date(eventEndTime)) ? <p className="text-xs capitalize text-meta-1 dark:text-white">Event Closed</p> :
                                                                                <p className="text-xs capitalize text-meta-6 dark:text-white">Live</p>
                                                                    }
                                                                </div>
                                                            </td>
                                                            : null
                                                    }
                                                    {
                                                        apiParams.postType === 'review' ?
                                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                                <UserDetailedView
                                                                    id={data && data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef._id ? data.reviewedBusinessProfileRef._id : '-'}
                                                                    name={data && data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.name ? data.reviewedBusinessProfileRef.name : '-'}
                                                                    username={data && data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.username ? data.reviewedBusinessProfileRef.username : '-'}
                                                                    accountType={data && data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.accountType ? data.reviewedBusinessProfileRef.accountType : '-'}
                                                                    image={(data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.profilePic && data.reviewedBusinessProfileRef.profilePic.small) ? data.reviewedBusinessProfileRef.profilePic.small : undefined}
                                                                    register={!data.googleReviewedBusiness ? false : true}
                                                                />
                                                            </td>
                                                            : null
                                                    }
                                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                                                        <p className="text-black dark:text-white text-xs font-semibold text-center">
                                                            {data.reportCount ?? 0}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                        {data.isPublished ? <span className="text-meta-3 text-xs font-bold tracking-wide">Published</span>
                                                            : <span className="text-meta-4 text-xs tracking-wide dark:text-meta-9">Unpublished</span>
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
                                                            <button className="hover:text-primary" disabled={data.mediaRef && data.mediaRef.length === 0} onClick={() => {
                                                                setMediaModel(true);
                                                                if (data.mediaRef && data.mediaRef) {
                                                                    setMedia(data.mediaRef);
                                                                }
                                                            }}>
                                                                <svg className={`${data.mediaRef && data.mediaRef.length !== 0 ? 'fill-current' : 'fill-slate-200'}`} width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z" fill=""></path><path fillRule="evenodd" clipRule="evenodd" d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z" fill=""></path>
                                                                </svg>
                                                            </button>
                                                            <Button.Edit onClick={() => {
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
                                                            }} />
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
    );
};



export default PostTable;
