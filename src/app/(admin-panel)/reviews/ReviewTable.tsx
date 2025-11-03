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
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { fetchReviews } from "@/api-services/review";
import { UserDetailedView } from "@/components/Profile";
import Loading from "@/components/Loading";
const ReviewTable = () => {
  const initialInputs = {
    content: '',
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
    queryKey: ['reviews', debouncedTerm, pageNo, apiParams],
    queryFn: () => fetchReviews({
      query: debouncedTerm,
      documentLimit: 20,
      pageNumber: pageNo,

    }),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    setPageNo(1);
  }, [])
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
        const response = await apiRequest.delete(`admin/reviews/${id}`);
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
              All Review
            </h4>
          </div>
          {/* <div className="flex items-center">
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
                {/* <div className="mb-3">
                                    <label htmlFor="name" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Name</label>
                                    <input id="name" placeholder="Enter name" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="name" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                </div> */}
                <div className="mb-3">
                  <label htmlFor="content" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Content</label>
                  <textarea name="content" id="content" required={true} cols={30} rows={3} placeholder="Enter content" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.content} onChange={(e) => setFormInputs({ ...formInputs, content: e.target.value })}></textarea>
                </div>
                {/* <div className="mb-3 flex gap-3">
                                    <div >
                                        <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Select level</label>
                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                <ListIcon />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, level: e.target.value })} value={formInputs.level}>
                                                <option value="" disabled={false} className="text-body dark:text-bodydark">Select Type</option>
                                                <option value="basic" className="text-body dark:text-bodydark">Basic</option>
                                                <option value="standard" className="text-body dark:text-bodydark">Standard</option>
                                                <option value="premium" className="text-body dark:text-bodydark">Premium</option>
                                            </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                    <div >
                                        <label htmlFor="price" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Price</label>
                                        <input id="price" step={0.01} placeholder="Enter price" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="price" value={formInputs.price} onChange={(e) => setFormInputs({ ...formInputs, price: parseFloat(e.target.value) })} />
                                    </div>
                                    <div >
                                        <label htmlFor="currency" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Currency</label>
                                        <input id="currency" placeholder="Enter currency" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-50" type="text" name="currency" value={formInputs.currency} onChange={(e) => setFormInputs({ ...formInputs, currency: e.target.value })} disabled={true} />
                                    </div>
                                </div> */}
                {/* {
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
                            <label htmlFor="endTime" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">End Date</label>
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
                } */}
                <div className="mb-3 flex gap-3">
                  <div >
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Post Type</label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon />
                      </span>
                      {/* <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} disabled={true} onChange={(e) => setFormInputs({ ...formInputs, postType: e.target.value })} value={formInputs.postType}>
                        <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                        <option value="post" className="text-body dark:text-bodydark">Post</option>
                        <option value="review" className="text-body dark:text-bodydark">Review</option>
                        <option value="event" className="text-body dark:text-bodydark">Event</option>
                      </select> */}
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="isPublished" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Published in post</label>
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
                  Review
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Posted By
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Reviewed Business
                </th>
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
                  <tr >
                    <td colSpan={7} >
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 max-w-70 ">
                            <h5 className="line-clamp-2">
                              <span className="text-xs capitalize font-semibold" title={data.content && data.content}>{data.content && data.content}</span><br />
                            </h5>
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
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                            <UserDetailedView
                              id={data.postedBy && data.postedBy._id ? data.postedBy._id : '-'}
                              name={data && data.postedBy && data.postedBy.name ? data.postedBy.name : '-'}
                              username={data.postedBy && data.postedBy.username ? data.postedBy.username : '-'}
                              accountType={data.postedBy && data.postedBy.accountType ? data.postedBy.accountType : ''}
                              image={(data.postedBy && data.postedBy.profilePic && data.postedBy.profilePic.small) ? data.postedBy.profilePic.small : undefined}
                              register={!data.publicUserID ? false : true}
                            />
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <UserDetailedView
                              id={data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef._id ? data.reviewedBusinessProfileRef._id : '-'}
                              name={data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.name ? data.reviewedBusinessProfileRef.name : '-'}
                              username={data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.username ? data.reviewedBusinessProfileRef.username : '-'}
                              accountType={data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.accountType ? data.reviewedBusinessProfileRef.accountType : '-'}
                              image={(data.reviewedBusinessProfileRef && data.reviewedBusinessProfileRef.profilePic && data.reviewedBusinessProfileRef.profilePic.small) ? data.reviewedBusinessProfileRef.profilePic.small : undefined}
                              register={!data.googleReviewedBusiness ? false : true}
                            />

                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-2">
                            <p className="text-black dark:text-white text-xs font-semibold text-center">
                              {/* {data?.reportCount ?? 0} */}
                              0
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
                              <Button.Delete onClick={() => {
                                performDelete(data._id);
                              }} />
                              {/* <Button.Edit onClick={() => {
                                setID(data._id);
                                setModal(true);
                                setEditMode(true);
                                setFormInputs({
                                  ...formInputs,
                                  content: data?.content ?? '',
                                  name: data?.name ?? '',

                                  isPublished: data.isPublished,
                                  rating: data?.rating ?? 0,
                                })
                              }} /> */}

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



export default ReviewTable;
