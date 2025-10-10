"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import moment, { duration } from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import { SubscriptionPlans } from "@/types/subscription-plans";
import MultiSelect from "@/components/FormElements/MultiSelect";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import swal from "sweetalert";
import { features } from "process";
import { MinusIcon, PlusIcon, ListIcon, DownArrowIcon } from "@/components/Icons";
import { fetchBusinessTypes, fetchBusinessSubtypes } from "@/api-services/business";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchSubscriptionPlans } from "@/api-services/subscription";
import Loading from "@/components/Loading";
const SubscriptionPlansTable = () => {
  const features: string[] = [''];
  const initialInputs = {
    name: '',
    description: '',
    duration: '',
    price: 0,
    currency: 'INR',
    type: '',
    level: '',
    businessTypeID: '',
    businessSubtypeID: '',
    features: features,
    googleSubscriptionID: "",
    appleSubscriptionID: "",
    businessType: "",
    businessSubType: "",
  };
  const initialApiParams = {
    businessTypeID: '',
    businessSubtypeID: '',
    duration: '',
  }
  const { value } = useSearchInput();
  const [apiParams, setApiParams] = useState(initialApiParams);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [formInputs, setFormInputs] = useState(initialInputs);
  const [ID, setID] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(value);
      setPageNo(1);
    }, 600);
    return () => {
      clearTimeout(timerId);
    };
  }, [value]);
  const addFields = () => {
    let object = ''
    setFormInputs({ ...formInputs, features: [...formInputs.features, object] })
  }
  const removeFields = (index: number) => {
    let data = [...formInputs.features];
    data.splice(index, 1)
    setFormInputs({ ...formInputs, features: data });
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let data = [...formInputs.features];
    data[index] = event.target.value;
    setFormInputs({ ...formInputs, features: data });
  }
  const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ['subscription-plans', debouncedTerm, pageNo, apiParams,],
    queryFn: () => fetchSubscriptionPlans({
      duration: apiParams.duration,
      businessTypeID: apiParams.businessTypeID,
      businessSubtypeID: apiParams.businessSubtypeID,
      query: debouncedTerm,
      pageNumber: pageNo,
      documentLimit: 30,
    }),
    placeholderData: keepPreviousData,
  });

  const { data: businessTypes, refetch: refetchBusinessTypes } = useQuery({
    queryKey: ['business-types'],
    queryFn: () => fetchBusinessTypes(),
    placeholderData: keepPreviousData,
  });
  const { data: businessSubTypes, refetch: fetchBusinessSubTypes } = useQuery({
    queryKey: ['business-subtypes', apiParams.businessTypeID],
    queryFn: () => fetchBusinessSubtypes(apiParams.businessTypeID),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);
  useEffect(() => {
    setPageNo(1);
    setApiParams({ ...apiParams, businessTypeID: formInputs.businessTypeID, businessSubtypeID: '' })
  }, [formInputs.businessTypeID])

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // setButtonLoading(true);
      if (isEditMode) {
        const response = await apiRequest.put(`/admin/subscriptions/plans/${ID}`, { ...formInputs, price: parseFloat(formInputs.price.toString()).toFixed(2) });
        if (response.status === 200 && response.data.statusCode === 202) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
          setApiParams(initialApiParams);
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        const response = await apiRequest.post('/admin/subscriptions/plans', { ...formInputs, price: parseFloat(formInputs.price.toString()).toFixed(2) });
        if (response.status === 200 && response.data.statusCode === 201) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
          setApiParams(initialApiParams);
        } else {
          toast.error(response?.data?.message);
        }
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
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="flex justify-end items-center mb-2">
        <Button.IconButton text="Add Plan" variant="primary" onClick={() => {
          setModal(true)
          setEditMode(false);
          setFormInputs(initialInputs)
        }} icon={<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path></svg>} />
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              All Plans
            </h4>
          </div>
          <div className="flex gap-3">
            <div >
              <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Select Duration</label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                  <ListIcon width={16} height={16} />
                </span>
                <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white text-sm" onChange={(e) => setApiParams({ ...apiParams, duration: e.target.value })} value={apiParams.duration}>
                  <option value="" disabled={false} className="text-body dark:text-bodydark">Select Type</option>
                  <option value="monthly" className="text-body dark:text-bodydark">Monthly</option>
                  <option value="quarterly" className="text-body dark:text-bodydark">Quarterly</option>
                  <option value="yearly" className="text-body dark:text-bodydark">Yearly</option>
                  <option value="half-yearly" className="text-body dark:text-bodydark">Half Yearly</option>
                </select>
                <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                  <DownArrowIcon width={16} height={16} />
                </span>
              </div>
            </div>
            <div>
              <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Business Type</label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                  <ListIcon width={16} height={16} />
                </span>
                <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white text-sm" onChange={(e) =>
                  setApiParams({ ...apiParams, businessTypeID: e.target.value, businessSubtypeID: '' })} value={apiParams.businessTypeID}>

                  <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                  {
                    businessTypes && businessTypes.map((data, index) => (
                      <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                    ))
                  }
                </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                  <DownArrowIcon width={16} height={16} />
                </span>
              </div>
            </div>
            <div>
              <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Business Subtype</label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                  <ListIcon width={16} height={16} />
                </span>
                <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white text-sm" onChange={(e) => setApiParams({ ...apiParams, businessSubtypeID: e.target.value, })} value={apiParams.businessSubtypeID}>
                  <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                  {
                    businessSubTypes && businessSubTypes.map((data, index) => (
                      <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                    ))
                  }
                </select>
                <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                  <DownArrowIcon width={16} height={16} />
                </span>
              </div>
            </div>
            <div className="flex items-end">
              <button className={`rounded px-2 py-1.5  text-white transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  text-sm ${apiParams.businessTypeID !== "" || apiParams.duration !== '' ? 'bg-primary' : 'bg-primary/20'}`} disabled={apiParams.businessTypeID !== "" || apiParams.duration !== '' ? false : true} onClick={(e) => {
                setApiParams(initialApiParams)
              }}>
                <svg className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" role="button" width="22" height="22" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z" fill="currentColor"></path></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          {/* Subscription */}
          <div className={`${modal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
            <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
              <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setModal(false)}>
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                </svg>
              </button>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Name</label>
                  <input id="name" placeholder="Enter name" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="name" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Description</label>
                  <textarea name="description" id="description" required={true} cols={30} rows={4} placeholder="Enter description" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.description} onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}></textarea>
                </div>

                <div className="mb-3 grid grid-cols-1 xsm:grid-cols-3 gap-3">
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

                </div>
                <div className="mb-3 grid grid-cols-1 xsm:grid-cols-2 gap-3">
                  <div >
                    <label htmlFor="appleSubscriptionID" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Apple Subscription ID</label>
                    <input id="appleSubscriptionID" placeholder="Enter Subscription ID" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="appleSubscriptionID" value={formInputs.appleSubscriptionID} onChange={(e) => setFormInputs({ ...formInputs, appleSubscriptionID: e.target.value })} />
                  </div>
                  <div >
                    <label htmlFor="googleSubscriptionID" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Google Subscription ID</label>
                    <input id="googleSubscriptionID" placeholder="Enter Subscription ID" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-50" type="text" name="googleSubscriptionID" value={formInputs.googleSubscriptionID} onChange={(e) => setFormInputs({ ...formInputs, googleSubscriptionID: e.target.value })} />
                  </div>

                </div>
                <div className="mb-3 grid grid-cols-1 xsm:grid-cols-2 gap-3">
                  <div >
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Select Duration</label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon />
                      </span>
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, duration: e.target.value })} value={formInputs.duration}>
                        <option value="" disabled={false} className="text-body dark:text-bodydark">Select Type</option>
                        <option value="monthly" className="text-body dark:text-bodydark">Monthly</option>
                        <option value="quarterly" className="text-body dark:text-bodydark">Quarterly</option>
                        <option value="yearly" className="text-body dark:text-bodydark">Yearly</option>
                        <option value="half-yearly" className="text-body dark:text-bodydark">Half Yearly</option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Select Type</label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon />
                      </span>
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} value={formInputs.type}>
                        <option value="" disabled={false} className="text-body dark:text-bodydark">Select Type</option>
                        <option value="individual" className="text-body dark:text-bodydark">Individual</option>
                        <option value="business" className="text-body dark:text-bodydark">Business</option>
                      </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                </div>
                {
                  formInputs.type === "business" ?
                    <div className="mb-3 grid-cols-1 xsm:grid-cols-2 gap-3">
                      <div >
                        <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Business Type</label>
                        <div className="relative z-20 bg-white dark:bg-form-input">
                          <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                            <ListIcon />
                          </span>
                          <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, businessTypeID: e.target.value, businessSubtypeID: '' })} value={formInputs.businessTypeID}>
                            <option value="" disabled={false} className="text-body dark:text-bodydark">Select Business Type</option>
                            {
                              businessTypes && businessTypes.map((data, index) => (
                                <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                              ))
                            }
                          </select>
                          <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                            <DownArrowIcon />
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Business Subtype</label>
                        <div className="relative z-20 bg-white dark:bg-form-input">
                          <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                            <ListIcon />
                          </span>
                          <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, businessSubtypeID: e.target.value })} value={formInputs.businessSubtypeID}>
                            <option value="" disabled={false} className="text-body dark:text-bodydark">Select Business Subtype</option>
                            {
                              businessSubTypes && businessSubTypes.map((data, index) => (
                                <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                              ))
                            }
                          </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                            <DownArrowIcon />
                          </span>
                        </div>
                      </div>
                    </div> : null
                }
                <div className="mb-3"><label htmlFor="taskList" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Features</label>
                  <div className="flex flex-col gap-3.5">
                    {formInputs.features && formInputs.features.map((feature, index) => {
                      return (
                        <div className="flex items-center gap-2.5">
                          <input id={`feature_${index}`} placeholder="Enter here"
                            className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                            type="text" name={`feature_${index}`}
                            required={true}
                            onChange={event => handleInputChange(event, index)}
                            value={feature}
                          />
                          {
                            index === 0 ?
                              <button type="button" className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark" onClick={addFields}>
                                <PlusIcon />
                              </button>
                              :
                              <button type="button" className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark" onClick={(e) => removeFields(index)}>
                                <MinusIcon />
                              </button>
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4.5 py-2.5 font-medium text-white hover:bg-opacity-90">
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </form>
            </div>
          </div>
          {/* Subscription View Model */}
          <div className={`${viewModal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
            <div className="relative m-auto w-full max-w-lg rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
              <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setViewModal(false)}>
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                </svg>
              </button>
              <div className="flex flex-col items-start  p-4">
                <div className="">
                  <h2 className="font-extrabold text-3xl mb-2 text-black dark:text-white">
                    {
                      formInputs.name
                    }
                  </h2>
                  <div className="my-1">
                    <h4 className="font-extrabold text-2xl text-black dark:text-white">

                      {
                        formInputs.businessType
                      }
                      &nbsp;
                      <span className="text-sm capitalize opacity-85">
                        {
                          formInputs.businessSubType
                        } {formInputs.type} Plan
                      </span>
                      &nbsp; &nbsp;
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1  items-start my-4">
                    <div className={`text-meta-4 flex gap-1 items-center text-xs font-normal tracking-wide`}>
                      {formInputs.googleSubscriptionID ? formInputs.googleSubscriptionID :
                        <>
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 fill-meta-8">
                              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path>
                            </svg>
                          </div> Google Subscription ID is missing.
                        </>
                      }
                    </div>
                    <div className={`text-meta-4 flex gap-1 items-center text-xs font-normal tracking-wide`}>
                      {formInputs.appleSubscriptionID ? formInputs.appleSubscriptionID :
                        <>
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 fill-meta-8">
                              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path>
                            </svg>
                          </div>
                          Apple Subscription ID is missing.
                        </>
                      }
                    </div>
                  </div>
                  <p className="text-xs">
                    {
                      formInputs.description
                    }
                  </p>
                  <div className="flex items-end my-4 justify-start">
                    <p className="font-extrabold text-4xl">
                      {formInputs.currency === "INR" ? <span className="font-normal text-xl">₹</span> : formInputs.currency}  {formInputs.price}
                      <span className="text-sm">
                        &nbsp;/ {formInputs.duration}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 justify-start">
                  {
                    formInputs.features.map((feature, index) => {
                      return (
                        <p className="flex gap-1  items-start text-sm text-black-2 dark:text-white">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 mr-2">
                              <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd"></path>
                            </svg>
                          </div>
                          {feature}
                        </p>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Subscription IDs
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Price/ Duration
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Business Type
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Business Subtype
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
                    <td colSpan={6} className="text-center">
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <div>
                                <div className="h-15 w-15 rounded-md bg-primary flex justify-center items-center">
                                  <Image src={data && data.image ? data.image : '/images/data-placeholder.jpg'} alt={data.name} width={80} height={80} className="w-7 h-7 object-cover" />
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-black dark:text-white">
                                  {data.name}
                                  <small className="text-xs capitalize"> ({data.type})</small>
                                </h5>
                                <p className="text-xs text-black dark:text-white mb-1">{data.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5 ">
                            <div className="flex flex-col gap-1">
                              <div className={`${data.googleSubscriptionID ? "text-meta-4" : "text-meta-1"} flex gap-1 items-center text-xs font-normal tracking-wide`}>
                                {data.googleSubscriptionID ?
                                  data.googleSubscriptionID
                                  :
                                  <>
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 fill-meta-1">
                                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path>
                                      </svg>
                                    </div>
                                    Google Subscription ID is missing.
                                  </>
                                }
                              </div>
                              <div className={`${data.appleSubscriptionID ? "text-meta-4" : "text-meta-1"} flex gap-1 items-center text-xs font-normal tracking-wide`}>
                                {data.appleSubscriptionID ?
                                  data.appleSubscriptionID
                                  :
                                  <>
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 fill-meta-1">
                                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path>
                                      </svg>
                                    </div>
                                    Apple Subscription ID is missing.
                                  </>
                                }
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-1.5">
                            <span className="text-sm font-semibold tracking-wide capitalize text-meta-4">
                              {data.currency === "INR" ? "₹" : data.currency} {data.price}/ {data.duration}
                            </span>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {data && data.businessTypeRef && data.businessTypeRef.name}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {data && data.businessSubtypeRef && data.businessSubtypeRef.name}
                            </p>
                          </td>

                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm font-medium">
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
                              <Button.Edit onClick={() => {
                                setID(data._id);
                                setModal(true);
                                setEditMode(true);
                                setFormInputs({
                                  ...formInputs,
                                  name: data.name,
                                  description: data.description,
                                  duration: data.duration,
                                  price: data.price,
                                  currency: data.currency,
                                  type: data.type,
                                  level: data.level,
                                  businessTypeID: data.businessTypeID?.[0] ?? '',
                                  businessSubtypeID: data.businessSubtypeID?.[0] ?? '',
                                  features: data.features.length !== 0 ? data.features : [''],
                                  googleSubscriptionID: data.googleSubscriptionID,
                                  appleSubscriptionID: data.appleSubscriptionID,
                                })
                              }} />
                              <Button.View onClick={() => {
                                const businessType = (data && data.businessTypeRef && data.businessTypeRef) ? data.businessTypeRef.name : '';
                                const businessSubType = (data && data.businessSubtypeRef && data.businessSubtypeRef) ? data.businessSubtypeRef.name : ''

                                setID(data._id);
                                setViewModal(true);
                                setEditMode(true);
                                setFormInputs({
                                  ...formInputs,
                                  name: data.name,
                                  description: data.description,
                                  duration: data.duration,
                                  price: data.price,
                                  currency: data.currency,
                                  type: data.type,
                                  level: data.level,
                                  businessType: businessType,
                                  businessSubType: businessSubType,
                                  features: data.features.length !== 0 ? data.features : [''],
                                  googleSubscriptionID: data.googleSubscriptionID,
                                  appleSubscriptionID: data.appleSubscriptionID,
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



export default SubscriptionPlansTable;
