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
import swal from "sweetalert";
import { fetchReports } from "@/api-services/report";
import { UserDetailedView } from "@/components/Profile";
import Loading from "@/components/Loading";
import { DefaultPlaceholderImage } from "@/components/Layouts/Placeholder";
const ReportsTable = () => {
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const initialApiParams = {
    contentType: '',
  }
  const [apiParams, setApiParams] = useState(initialApiParams);
  const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ['reports', pageNo, apiParams],
    queryFn: () => fetchReports({
      query: "",
      documentLimit: 20,
      pageNumber: pageNo,
      contentType: apiParams.contentType,
    }),
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
        const response = await apiRequest.delete(`/admin/reports/${id}`);
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
              All Reports
            </h4>
          </div>
          <div className="flex">
            <button type="button" onClick={(e) => setApiParams({ ...apiParams, contentType: '' })} className={`${apiParams.contentType === '' ? 'border-primary bg-primary text-white ' : ' border-stroke'}  border inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
              All
            </button>
            <button type="button" onClick={(e) => setApiParams({ ...apiParams, contentType: 'post' })} className={`${apiParams.contentType === 'post' ? 'border-primary bg-primary text-white ' : ' border-stroke'} border-y inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
              Post
            </button>
            <button type="button" onClick={(e) => setApiParams({ ...apiParams, contentType: 'user' })} className={`${apiParams.contentType === 'user' ? 'border-primary bg-primary text-white ' : ' border-stroke'} border-s-0 border inline-flex px-2 py-1 font-medium text-sm  hover:border-primary hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:border-primary sm:px-6 sm:py-2`}>
              User
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Reported By
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Reported Content
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Content
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Reason
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
                    <td colSpan={6} >
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <UserDetailedView
                                id={(data && data.reportedByRef._id) ?? "6732d3280b82b6c62ea51acc"}
                                name={(data && data.reportedByRef.name) ?? "N/A"}
                                username={(data && data.reportedByRef.username) ?? "N/A"}
                                accountType={(data && data.reportedByRef.accountType) ?? "N/A"}
                                image={data && data.reportedByRef.accountType === "business" ?
                                  (data.reportedByRef.businessProfileRef?.profilePic?.small ? data.reportedByRef.businessProfileRef?.profilePic?.small : undefined) :
                                  (data.reportedByRef?.profilePic?.small ? data.reportedByRef?.profilePic?.small : undefined)}
                              />
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white capitalize">
                              {data && data.contentType}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {data && data.contentType === "user" ?
                              <UserDetailedView
                                id={(data && data.usersRef && data.usersRef._id) ?? "6732d3280b82b6c62ea51acc"}
                                name={(data && data.usersRef && data.usersRef.name) ?? "N/A"}
                                username={(data && data.usersRef && data.usersRef.username) ?? "N/A"}
                                accountType={(data && data.usersRef && data.usersRef.accountType) ?? "N/A"}
                                image={data && data.usersRef && data.usersRef.accountType === "business" ?
                                  (data.usersRef.businessProfileRef?.profilePic?.small ? data.usersRef.businessProfileRef?.profilePic?.small : undefined) :
                                  (data.usersRef?.profilePic?.small ? data.usersRef?.profilePic?.small : undefined)}
                              />
                              :
                              data && data.contentType === "comment" ?
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                  <div>
                                    <div className="h-15 w-15 rounded-md bg-black/10 dark:bg-meta-4  flex justify-center items-center">
                                      <Image src={DefaultPlaceholderImage} alt={'Post image'} width={80} height={80} className="w-15 h-15 object-cover rounded-md" />
                                    </div>
                                  </div>
                                  <div className="max-w-80">
                                    <h5 className="font-semibold text-black dark:text-white">
                                      <span className="capitalize">{data.commentsRef && data.commentsRef.postType}</span>
                                      <small className="text-xs capitalize ms-2"> ({data.commentsRef?._id})</small>
                                    </h5>
                                    <p className="text-xs text-black dark:text-white mb-1 truncate" title={data && data.commentsRef?.message}>{data && data.commentsRef?.message}</p>
                                  </div>
                                </div>
                                :
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                  <div>
                                    <div className="h-15 w-15 rounded-md bg-black/10 dark:bg-meta-4  flex justify-center items-center">
                                      <Image src={DefaultPlaceholderImage} alt={'Post image'} width={80} height={80} className="w-15 h-15 object-cover rounded-md" />
                                    </div>
                                  </div>
                                  <div className="max-w-80">
                                    <h5 className="font-semibold text-black dark:text-white">
                                      <span className="capitalize">{data.postsRef && data.postsRef.postType}</span>
                                      <small className="text-xs capitalize ms-2"> ({data.postsRef?._id})</small>
                                    </h5>
                                    <p className="text-xs text-black dark:text-white mb-1 truncate" title={data && data.postsRef?.content}>{data && data.postsRef?.content}</p>
                                  </div>
                                </div>
                            }
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white capitalize">
                              {data.reason ?? 'N/A'}
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
export default ReportsTable;
