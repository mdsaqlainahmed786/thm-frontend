"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import { FAQ } from "@/types/faq";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import swal from "sweetalert";
import { Contact } from "@/types/contact";
import Loading from "@/components/Loading";
const ContactTable = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('query');
  const [query, setQuery] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  useEffect(() => {
    setQuery(query);
  }, [search]);

  const fetchData = async () => {
    try {
      const response = await apiRequest.get(`/contact-us`, {
        params: {
          query: "",
          documentLimit: 20,
          pageNumber: pageNo
        }
      });
      if (response.status === 200 && response.data.status) {
        const responseData = response.data;
        return responseData as {
          data: Contact[];
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
    queryKey: ['contact-us', query, pageNo],
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
        const response = await apiRequest.delete(`contact-us/${id}`);
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
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              All Contact
            </h4>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name / Email
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Message
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
                              {data.name}
                            </h5>
                            <p className="text-sm text-black dark:text-white mb-1">{data.email}</p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white capitalize">
                              {data.message}
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
        </div >
      </div >
    </div >
  );
};

export default ContactTable;
