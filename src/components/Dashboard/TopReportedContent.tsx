"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTopReports } from "@/api-services/report";
import moment from "moment";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { DefaultProfilePic, UserDetailedView } from "../Profile";
import { DefaultPlaceholderImage } from "../Layouts/Placeholder";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const getChartOptions = (total: number): ApexOptions => ({
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#0FADCF", "#FF6384"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: ["#6366F1", "#22D3EE", "#FB7185"],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.8,
      stops: [0, 100],
    },
  },
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        background: "transparent",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "14px",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 600,
            color: "#ffffff",
            offsetY: -10,
            formatter: function (val: string) {
              return "Total";
            },
          },
          value: {
            show: true,
            fontSize: "24px",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 700,
            color: "#ffffff",
            offsetY: 10,
            formatter: function (val: string) {
              return total.toString();
            },
          },
          total: {
            show: false,
          },
        },
      },
    },
  },
  labels: ["Users", "Posts", "Comments"],
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val: number) {
        return val + " reports";
      },
    },
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
        legend: {
          show: false,
        },
      },
    },
  ],
});
const TopReportedContent = () => {
  const router = useRouter();
  const initialApiParams = {
    contentType: "",
    overview: "",
  };
  const [series, setSeries] = useState([0, 0, 0]);
  const [apiParams, setApiParams] = useState(initialApiParams);
  const [totalReports, setTotalReports] = useState(0);

  const getContentTypeColor = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case "post":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "user":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "comment":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const handleRowClick = (data: any) => {
    if (data.contentType === "user" && data.usersRef?._id) {
      router.push(`/users/${data.usersRef._id}`);
    } else if (data.contentType === "post" && data.postsRef?._id) {
      // router.push(`/posts/${data.postsRef._id}`);
    } else if (data.contentType === "comment" && data.commentsRef?._id) {
      // router.push(`/comments/${data.commentsRef._id}`);
    }
  };
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["top-reports", apiParams],
    queryFn: () =>
      fetchTopReports({
        contentType: apiParams.contentType,
        overview: apiParams.overview,
      }),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data && data.reports && data.reports.length) {
      const seriesData = ["Users", "Posts", "Comments"].map((label) => {
        const singular = label.replace(/s$/, "").toLowerCase();
        const filterData = data.reports.filter(
          (report) => report.labelName === singular
        );
        return filterData.length !== 0 ? filterData[0].totalReports : 0;
      });
      setSeries(seriesData);

      // Calculate total reports
      const total = seriesData.reduce((sum, val) => sum + val, 0);
      setTotalReports(total);
    } else {
      setTotalReports(0);
    }
  }, [data]);
  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-8">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-white/10 dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-7.5 justify-between sm:flex">
            <div className="mb-2">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Top Reports
              </h3>
            </div>
            <div className="mb-2">
              <div className="relative z-20 inline-block rounded bg-gray-2 dark:bg-boxdark-hover">
                <select
                  name="contentType"
                  id="contentType"
                  value={apiParams.contentType}
                  onChange={(e) =>
                    setApiParams({ ...apiParams, contentType: e.target.value })
                  }
                  className="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-1 pl-3 pr-8 text-sm outline-none dark:border-strokedark"
                >
                  <option value="" className="dark:bg-boxdark-hover">
                    All
                  </option>
                  <option value="post" className="dark:bg-boxdark-hover">
                    Post
                  </option>
                  <option value="user" className="dark:bg-boxdark-hover">
                    User
                  </option>
                  <option value="comment" className="dark:bg-boxdark-hover">
                    Comment
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
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                      fill="#637381"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-lg">
            <div className="sticky top-0 z-10 grid grid-cols-3 rounded-t-lg bg-gray-2 dark:bg-boxdark-hover sm:grid-cols-5 shadow-sm">
              <div className="p-3 xl:p-5 col-span-2">
                <h5 className="text-sm font-semibold text-black dark:text-white xsm:text-base">
                  Content
                </h5>
              </div>
              <div className="p-3 text-center xl:p-5">
                <h5 className="text-sm font-semibold text-black dark:text-white xsm:text-base">
                  Content Type
                </h5>
              </div>
              <div className="p-3 text-center xl:p-5">
                <h5 className="text-sm font-semibold text-black dark:text-white xsm:text-base">
                  Total Reports
                </h5>
              </div>
              <div className="hidden p-3 text-center sm:block xl:p-5">
                <h5 className="text-sm font-semibold text-black dark:text-white xsm:text-base">
                  Last Report
                </h5>
              </div>
            </div>
            {isPending || isFetching ? (
              <div className="divide-y divide-stroke dark:divide-white/10">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 sm:grid-cols-5 animate-pulse"
                  >
                    <div className="flex items-center gap-4 p-4 xl:p-6 col-span-2">
                      <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-boxdark-hover flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-boxdark-hover rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-boxdark-hover rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-4 xl:p-6">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-boxdark-hover rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-center p-4 xl:p-6">
                      <div className="h-7 w-7 bg-gray-200 dark:bg-boxdark-hover rounded-full"></div>
                    </div>
                    <div className="hidden items-center justify-center p-4 sm:flex xl:p-6">
                      <div className="space-y-2 text-center">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto"></div>
                        <div className="h-3 w-20 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-stroke dark:divide-white/10">
                {data &&
                  data.documents &&
                  data.documents.map((item, index) => {
                    const isLast = index === (data.documents?.length ?? 0) - 1;
                    return (
                      <div
                        key={index}
                        onClick={() => handleRowClick(item)}
                        className={`grid grid-cols-3 sm:grid-cols-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-boxdark-hover/50 ${
                          isLast ? "rounded-b-lg" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4 p-4 xl:p-6 truncate col-span-2">
                          {item.contentType === "post" && item.postsRef ? (
                            <>
                              <div className="flex-shrink-0">
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-white/10">
                                  <Image
                                    src={DefaultPlaceholderImage}
                                    width={48}
                                    height={48}
                                    alt="Post Image"
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-black dark:text-white capitalize truncate">
                                    {item.postsRef && item.postsRef.postType}
                                  </span>
                                  <span className="text-xs text-bodydark2 dark:text-bodydark truncate">
                                    {item.postsRef &&
                                      item.postsRef._id?.substring(0, 8)}
                                  </span>
                                </div>
                                <p className="hidden text-black/70 dark:text-white/70 sm:block text-sm truncate">
                                  {item.postsRef.content}
                                </p>
                              </div>
                            </>
                          ) : null}
                          {item.contentType === "user" && item.usersRef ? (
                            <UserDetailedView
                              id={item.usersRef && item.usersRef._id}
                              name={item.usersRef && item.usersRef.name}
                              username={item.usersRef && item.usersRef.username}
                              accountType={
                                item.usersRef && item.usersRef.accountType
                              }
                              image={
                                item &&
                                item.usersRef &&
                                item.usersRef.accountType === "business"
                                  ? item.usersRef.businessProfileRef?.profilePic
                                      ?.small
                                    ? item.usersRef.businessProfileRef
                                        ?.profilePic?.small
                                    : undefined
                                  : item.usersRef?.profilePic?.small
                                  ? item.usersRef?.profilePic?.small
                                  : undefined
                              }
                            />
                          ) : null}
                          {item.contentType === "comment" &&
                          item.commentsRef ? (
                            <>
                              <div className="flex-shrink-0">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-white/10">
                                  <Image
                                    src={DefaultProfilePic}
                                    alt={"Comment"}
                                    width={48}
                                    height={48}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-black dark:text-white capitalize truncate">
                                    {item.commentsRef &&
                                      item.commentsRef.postType}
                                  </span>
                                  <span className="text-xs text-bodydark2 dark:text-bodydark truncate">
                                    {item.commentsRef &&
                                      item.commentsRef._id?.substring(0, 8)}
                                  </span>
                                </div>
                                <p className="hidden text-black/70 dark:text-white/70 sm:block text-sm truncate capitalize">
                                  {item.commentsRef?.message}
                                </p>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-center p-4 xl:p-6">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getContentTypeColor(
                              item.contentType
                            )}`}
                          >
                            {item.contentType}
                          </span>
                        </div>
                        <div className="flex items-center justify-center p-4 xl:p-6">
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-500/10 text-red-500 text-sm font-bold">
                            {item.totalReports}
                          </span>
                        </div>
                        <div className="hidden items-center justify-center p-4 sm:flex xl:p-6">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-black dark:text-white">
                              {moment(item.createdAt).format(
                                "ddd DD, MMM YYYY"
                              )}
                            </p>
                            <p className="text-xs text-bodydark2 dark:text-bodydark mt-0.5">
                              {moment(item.createdAt).format("hh:mm:ss A")}
                            </p>
                            <p className="text-xs text-bodydark2 dark:text-bodydark mt-1">
                              {moment(item.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-white/10 dark:bg-boxdark sm:px-7.5 xl:col-span-4 overflow-hidden">
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
                onChange={(e) =>
                  setApiParams({ ...apiParams, overview: e.target.value })
                }
              >
                <option value="" className="dark:bg-boxdark-hover">
                  Full
                </option>
                <option value="monthly" className="dark:bg-boxdark-hover">
                  Monthly
                </option>
                <option value="yearly" className="dark:bg-boxdark-hover">
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
          {isPending || isFetching ? (
            <div className="mx-auto flex justify-center items-center h-[300px]">
              <div className="relative w-[300px] h-[300px] animate-pulse">
                <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-boxdark-hover"></div>
                <div className="absolute inset-[15%] rounded-full bg-white dark:bg-boxdark-2"></div>
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="h-4 w-12 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto"></div>
                </div>
              </div>
            </div>
          ) : (
            <div id="chartThree" className="mx-auto flex justify-center">
              <ReactApexChart
                options={getChartOptions(totalReports)}
                series={series}
                type="donut"
              />
            </div>
          )}
        </div>
        {isPending || isFetching ? (
          <div className="flex flex-col gap-3 px-2 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-boxdark-hover"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-boxdark-hover rounded"></div>
                </div>
                <div className="h-4 w-8 bg-gray-200 dark:bg-boxdark-hover rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="block h-3 w-3 rounded-full bg-[#3C50E0]"></span>
                <span className="text-sm font-medium text-black dark:text-white">
                  Users
                </span>
              </div>
              <span className="text-sm font-semibold text-black dark:text-white">
                {(data &&
                  data.reports &&
                  data.reports?.filter(
                    (data) => data?.labelName === "user"
                  )?.[0]?.totalReports) ??
                  0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="block h-3 w-3 rounded-full bg-[#0FADCF]"></span>
                <span className="text-sm font-medium text-black dark:text-white">
                  Posts
                </span>
              </div>
              <span className="text-sm font-semibold text-black dark:text-white">
                {(data &&
                  data.reports &&
                  data.reports?.filter(
                    (data) => data?.labelName === "post"
                  )?.[0]?.totalReports) ??
                  0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="block h-3 w-3 rounded-full bg-[#FF6384]"></span>
                <span className="text-sm font-medium text-black dark:text-white">
                  Comments
                </span>
              </div>
              <span className="text-sm font-semibold text-black dark:text-white">
                {(data &&
                  data.reports &&
                  data.reports?.filter(
                    (data) => data?.labelName === "comment"
                  )?.[0]?.totalReports) ??
                  0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TopReportedContent;
