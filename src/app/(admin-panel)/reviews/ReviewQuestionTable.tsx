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
import MultiSelect from "@/components/FormElements/MultiSelect";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import swal from "sweetalert";
import { fetchBusinessTypes } from "@/api-services/business";
import { fetchBusinessSubtypes } from "@/api-services/business";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchBusinessReviewQuestions } from "@/api-services/business";
import Loading from "@/components/Loading";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
const ReviewQuestionTable = () => {
  const initialInputs = {
    question: '',
    order: 0,
    businessTypeID: '',
    businessSubtypeID: '',
  };
  const { value } = useSearchInput();
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [modal, setModal] = useState(false);
  const [formInputs, setFormInputs] = useState(initialInputs);
  const [ID, setID] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
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
    queryKey: ['review-question', debouncedTerm, pageNo],
    queryFn: () => fetchBusinessReviewQuestions({
      query: debouncedTerm,
      documentLimit: 20,
      pageNumber: pageNo
    }),
    placeholderData: keepPreviousData,
  });
  const { data: businessTypes, refetch: refetchBusinessTypes } = useQuery({
    queryKey: ['business-types', pageNo],
    queryFn: () => fetchBusinessTypes(),
    placeholderData: keepPreviousData,
  });
  const { data: businessSubTypes, refetch: refetchBusinessSubTypes } = useQuery({
    queryKey: ['business-types', formInputs.businessTypeID],
    queryFn: () => fetchBusinessSubtypes(formInputs.businessTypeID),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // setButtonLoading(true);
      if (isEditMode) {
        const response = await apiRequest.put(`/admin/review-questions/${ID}`, { ...formInputs });
        if (response.status === 200 && response.data.statusCode === 202) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        const response = await apiRequest.post('/admin/review-questions', { ...formInputs });
        if (response.status === 200 && response.data.statusCode === 201) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
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
        const response = await apiRequest.delete(`admin/review-questions/${id}`);
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
      <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              All Questions
            </h4>
          </div>
          <div className="flex">
            <Button.IconButton text="Add Question" variant="primary" onClick={() => {
              setModal(true)
              setEditMode(false);
              setFormInputs(initialInputs)
            }} icon={<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path></svg>} />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className={`${modal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
            <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
              <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setModal(false)}>
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                </svg>
              </button>
              <form onSubmit={handleFormSubmit}>

                <div className="mb-3">
                  <label htmlFor="question" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Description</label>
                  <textarea name="question" id="question" required={true} cols={30} rows={4} placeholder="Enter question" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.question} onChange={(e) => setFormInputs({ ...formInputs, question: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Business Type</label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                      <ListIcon />
                    </span>
                    <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, businessTypeID: e.target.value })} value={formInputs.businessTypeID}>
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
                <div className="mb-3">
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
                  Question
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
                    <td colSpan={5}>
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <div className="flex flex-col gap-1">
                              <h5 className="font-semibold text-black dark:text-white">
                                {data.question}
                                {/* <small className="text-xs capitalize"> ({data.type})</small> */}
                              </h5>
                              <p className="text-xs text-black dark:text-white mb-1">Question order {data.order}</p>
                            </div>
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
                                  question: data.question,
                                  order: data.order,
                                  businessTypeID: data.businessTypeID?.[0] ?? '',
                                  businessSubtypeID: data.businessSubtypeID?.[0] ?? '',
                                })
                              }} />
                              {/* <Button.View onClick={() => { route.push(`/subscriptions/${data._id}`) }} /> */}
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





export default ReviewQuestionTable;
