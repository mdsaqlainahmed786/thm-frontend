"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTopReports } from "@/api-services/report";
import moment from "moment";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { DefaultProfilePic, UserDetailedView } from "../Profile";
import { DefaultPlaceholderImage } from "../Layouts/Placeholder";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const options: ApexOptions = {
    chart: {
        fontFamily: "Satoshi, sans-serif",
        type: "donut",
    },
    colors: ["#3C50E0", "#0FADCF", "#FF6384"],
    labels: ["Users", "Posts", "Comments"],
    legend: {
        show: false,
        position: "bottom",
    },

    plotOptions: {
        pie: {
            donut: {
                size: "65%",
                background: "transparent",
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 2600,
            options: {
                chart: {
                    width: 380,
                },
            },
        },
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200,
                },
            },
        },
    ],
};
const TopReportedContent = () => {
    const initialApiParams = {
        contentType: '',
        overview: ''
    }
    const [series, setSeries] = useState([0, 0, 0]);
    const [apiParams, setApiParams] = useState(initialApiParams);
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['top-reports', apiParams],
        queryFn: () => fetchTopReports({
            contentType: apiParams.contentType,
            overview: apiParams.overview
        }),
        placeholderData: keepPreviousData,
    });
    useEffect(() => {
        if (data && data.reports && data.reports.length) {
            const seriesData = options.labels && Array.isArray(options.labels) ? options.labels.map((label) => {
                const singular = label.replace(/s$/, '').toLowerCase();
                const filterData = data.reports.filter((report) => report.labelName === singular);
                return filterData.length !== 0 ? filterData[0].totalReports : 0;
            }) : [];
            setSeries(seriesData);
        }
    }, [data])
    return (
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-8">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="mb-7.5 justify-between sm:flex"><div className="mb-2">
                        <h3 className="text-xl font-semibold text-black dark:text-white">Top Reports</h3>
                    </div>
                        <div className="mb-2">
                            <div className="relative z-20 inline-block rounded bg-gray-2 dark:bg-boxdark">
                                <select name="contentType" id="contentType" value={apiParams.contentType} onChange={(e) => setApiParams({ ...apiParams, contentType: e.target.value })} className="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-1 pl-3 pr-8 text-sm outline-none dark:border-strokedark">
                                    <option value="" className="dark:bg-boxdark">All</option>
                                    <option value="post" className="dark:bg-boxdark">Post</option>
                                    <option value="user" className="dark:bg-boxdark">User</option>
                                    <option value="comment" className="dark:bg-boxdark">Comment</option>
                                </select>
                                <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2"><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z" fill="#637381"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z" fill="#637381"></path></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                            <div className="p-2.5 xl:p-5 col-span-2"><h5 className="text-sm font-medium  xsm:text-base">Content</h5></div>
                            <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium  xsm:text-base">Content Type</h5></div>
                            <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium  xsm:text-base">Total Reports</h5></div>
                            <div className="hidden p-2.5 text-center sm:block xl:p-5"><h5 className="text-sm font-medium  xsm:text-base">Last Report</h5></div>

                        </div>
                        {
                            data && data.documents && data.documents.map((data, index) => {
                                return (
                                    <div key={index} className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark">
                                        <div className="flex items-center gap-3 p-2.5 xl:p-5 truncate col-span-2">
                                            {
                                                data.contentType === "post" && data.postsRef ?
                                                    <>
                                                        <div className="flex-shrink-0">
                                                            <Image src={DefaultPlaceholderImage} width={56} height={56} alt="Image" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold capitalize">{data.postsRef && data.postsRef.postType}</span>&nbsp;
                                                            <span className="text-xs">{data.postsRef && data.postsRef._id}</span><br />
                                                            <p className="hidden text-black dark:text-white sm:block text-xs">{data.postsRef.content}</p>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                            {
                                                data.contentType === "user" && data.usersRef ?
                                                    <UserDetailedView
                                                        id={data.usersRef && data.usersRef._id}
                                                        name={data.usersRef && data.usersRef.name}
                                                        username={data.usersRef && data.usersRef.username}
                                                        accountType={data.usersRef && data.usersRef.accountType}
                                                        image={data && data.usersRef && data.usersRef.accountType === "business" ?
                                                            (data.usersRef.businessProfileRef?.profilePic?.small ? data.usersRef.businessProfileRef?.profilePic?.small : undefined) :
                                                            (data.usersRef?.profilePic?.small ? data.usersRef?.profilePic?.small : undefined)}
                                                    />
                                                    : null
                                            }
                                            {
                                                data.contentType === "comment" && data.commentsRef ?
                                                    <>
                                                        <div className="flex-shrink-0">
                                                            <Image src={DefaultProfilePic} alt={'comments'} width={48} height={48} className="rounded-full h-9.5 w-9.5" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold capitalize">{data.commentsRef && data.commentsRef.postType}</span>&nbsp;
                                                            <span className="text-xs"> {data.commentsRef && data.commentsRef._id}</span><br />
                                                            <p className="hidden text-black dark:text-white sm:block text-xs capitalize">{data.commentsRef?.message}</p>
                                                        </div>
                                                    </>

                                                    : null
                                            }
                                        </div>
                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-black dark:text-white capitalize text-sm">
                                                {
                                                    data.contentType
                                                }
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-meta-1 text-sm font-bold">
                                                {data.totalReports}
                                            </p>
                                        </div>
                                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                            <p className="text-black dark:text-white text-xs font-bold">
                                                {moment(data.createdAt).format('ddd DD, MMM YYYY hh:mm:ss A')}<br></br>
                                                <span className="font-medium">
                                                    {moment(data.createdAt).fromNow()}
                                                </span>
                                            </p>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
                <div className="mb-3 justify-between gap-4 sm:flex">
                    <div>
                        <h5 className="text-xl font-semibold text-black dark:text-white">
                            Report Analytics
                        </h5>
                    </div>
                    <div>
                        <div className="relative z-20 inline-block">
                            <select
                                value={apiParams.overview}
                                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                                onChange={(e) => setApiParams({ ...apiParams, overview: e.target.value })}
                            >
                                <option value="" className="dark:bg-boxdark">
                                    Full
                                </option>
                                <option value="monthly" className="dark:bg-boxdark">
                                    Monthly
                                </option>
                                <option value="yearly" className="dark:bg-boxdark">
                                    Yearly
                                </option>
                            </select>
                            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                                        fill="#637381"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                                        fill="#637381"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <div id="chartThree" className="mx-auto flex justify-center">
                        <ReactApexChart options={options} series={series} type="donut" />
                    </div>
                </div>
                <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
                    <div className="w-full px-8 sm:w-1/2">
                        <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span>Users</span>
                                <span>{(data && data.reports && data.reports?.filter((data) => data?.labelName === 'user')?.[0]?.totalReports) ?? 0}</span>
                            </p>
                        </div>
                    </div>
                    <div className="w-full px-8 sm:w-1/2">
                        <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span>Posts</span>
                                <span>{(data && data.reports && data.reports?.filter((data) => data?.labelName === 'post')?.[0]?.totalReports) ?? 0}</span>
                            </p>
                        </div>
                    </div>
                    <div className="w-full px-8 sm:w-1/2">
                        <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FF6384]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span>Comments</span>
                                <span>{(data && data.reports && data.reports?.filter((data) => data?.labelName === 'comment')?.[0]?.totalReports) ?? 0}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default TopReportedContent;
