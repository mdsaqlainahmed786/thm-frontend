"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import { FAQ } from "@/types/faq";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import swal from "sweetalert";
import Loading from "@/components/Loading";
const FAQsTable = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('query');
  const initialInputs = {
    question: '',
    answer: '',
    isPublished: false,
    type: ''
  };
  const [query, setQuery] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [modal, setModal] = useState(false);
  const [formInputs, setFormInputs] = useState(initialInputs);
  const [ID, setID] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  useEffect(() => {
    setQuery(query);
  }, [search]);

  const fetchData = async () => {
    try {
      const response = await apiRequest.get(`/faqs`, {
        params: {
          project: "full",
          query: "",
          documentLimit: 20,
          pageNumber: pageNo
        }
      });
      if (response.status === 200 && response.data.status) {
        const responseData = response.data;
        return responseData as {
          data: FAQ[];
          pageNo: number;
          totalPages: number;
          totalResources: number
        };
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
    queryKey: ['faqs', query, pageNo],
    queryFn: () => fetchData(),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);
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
        const response = await apiRequest.delete(`faqs/${id}`);
        if (response.status === 200 && response.data.statusCode === 204) {
          refetch();
          toast.success(response?.data?.message);
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {

    } finally {

    }
  }
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // setButtonLoading(true);
      if (isEditMode) {
        const response = await apiRequest.put(`faqs/${ID}`, formInputs);
        if (response.status === 200 && response.data.statusCode === 202) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        const response = await apiRequest.post('faqs', formInputs);
        if (response.status === 200 && response.data.statusCode === 201) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      console.log("catch :::", error)
    } finally {
      // setButtonLoading(false);
    }
  }
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              All Contact
            </h4>
          </div>
          <Button.IconButton text="Add Question" variant="primary" onClick={() => {
            setModal(true)
            setEditMode(false);
            setFormInputs(initialInputs)
          }} icon={<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path></svg>} />
        </div>
        <div className="max-w-full overflow-x-auto">
          {/* FAQ Model */}
          <div className={`${modal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
            <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
              <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setModal(false)}>
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                </svg>
              </button>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="question" className="mb-1 block font-medium text-black dark:text-white">Question</label>
                  <input id="question" placeholder="Enter question" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="question" value={formInputs.question} onChange={(e) => setFormInputs({ ...formInputs, question: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="answer" className="mb-1 block font-medium text-black dark:text-white">Answer</label>
                  <textarea name="answer" id="answer" required={true} cols={30} rows={4} placeholder="Enter answer" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.answer} onChange={(e) => setFormInputs({ ...formInputs, answer: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block font-medium text-black dark:text-white">Select Type</label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_130_9728)" ><path d="M3.45928 0.984375H1.6874C1.04053 0.984375 0.478027 1.51875 0.478027 2.19375V3.96563C0.478027 4.6125 1.0124 5.175 1.6874 5.175H3.45928C4.10615 5.175 4.66865 4.64063 4.66865 3.96563V2.16562C4.64053 1.51875 4.10615 0.984375 3.45928 0.984375ZM3.3749 3.88125H1.77178V2.25H3.3749V3.88125Z" fill=""></path><path d="M7.22793 3.71245H16.8748C17.2123 3.71245 17.5217 3.4312 17.5217 3.06558C17.5217 2.69995 17.2404 2.4187 16.8748 2.4187H7.22793C6.89043 2.4187 6.58105 2.69995 6.58105 3.06558C6.58105 3.4312 6.89043 3.71245 7.22793 3.71245Z" fill=""></path><path d="M3.45928 6.75H1.6874C1.04053 6.75 0.478027 7.28437 0.478027 7.95937V9.73125C0.478027 10.3781 1.0124 10.9406 1.6874 10.9406H3.45928C4.10615 10.9406 4.66865 10.4062 4.66865 9.73125V7.95937C4.64053 7.28437 4.10615 6.75 3.45928 6.75ZM3.3749 9.64687H1.77178V8.01562H3.3749V9.64687Z" fill=""></path><path d="M16.8748 8.21252H7.22793C6.89043 8.21252 6.58105 8.49377 6.58105 8.8594C6.58105 9.22502 6.86231 9.47815 7.22793 9.47815H16.8748C17.2123 9.47815 17.5217 9.1969 17.5217 8.8594C17.5217 8.5219 17.2123 8.21252 16.8748 8.21252Z" fill=""></path><path d="M3.45928 12.8531H1.6874C1.04053 12.8531 0.478027 13.3875 0.478027 14.0625V15.8344C0.478027 16.4813 1.0124 17.0438 1.6874 17.0438H3.45928C4.10615 17.0438 4.66865 16.5094 4.66865 15.8344V14.0625C4.64053 13.3875 4.10615 12.8531 3.45928 12.8531ZM3.3749 15.75H1.77178V14.1188H3.3749V15.75Z" fill=""></path><path d="M16.8748 14.2875H7.22793C6.89043 14.2875 6.58105 14.5687 6.58105 14.9344C6.58105 15.3 6.86231 15.5812 7.22793 15.5812H16.8748C17.2123 15.5812 17.5217 15.3 17.5217 14.9344C17.5217 14.5687 17.2123 14.2875 16.8748 14.2875Z" fill=""></path></g><defs><clipPath id="clip0_130_9728"><rect width="18" height="18" fill="white"></rect></clipPath></defs></svg>
                    </span>
                    <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} value={formInputs.type}>
                      <option value="" disabled={false} className="text-body dark:text-bodydark">Select Type</option>
                      <option value="content" className="text-body dark:text-bodydark">Content</option>
                      <option value="general" className="text-body dark:text-bodydark">General</option>
                      <option value="privacy" className="text-body dark:text-bodydark">Privacy</option>
                      <option value="account" className="text-body dark:text-bodydark">Account</option>
                    </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.8">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="#637381"></path></g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  <div>
                    <label htmlFor="isPublished" className="mb-1 block font-medium text-black dark:text-white">Activated</label>
                    <div>
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
                  Question
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Type
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
                    <td colSpan={4} >
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-semibold text-black dark:text-white">
                              {data.question}
                            </h5>
                            <p className="text-sm text-black dark:text-white mb-1">{data.answer}</p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white capitalize">
                              {data.type}
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
                                  answer: data.answer,
                                  isPublished: data.isPublished,
                                  type: data.type
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
        </div >
      </div >
    </div >
  );
};

export default FAQsTable;
