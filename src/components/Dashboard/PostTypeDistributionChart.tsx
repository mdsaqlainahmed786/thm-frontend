"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPostTypeDistribution } from "@/api-services/post";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartSkeleton from "@/components/Loading/ChartSkeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TypeDistributionData {
  post: number;
  event: number;
  review: number;
}

const PostTypeDistributionChart: React.FC = () => {
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["post-type-distribution"],
    queryFn: () => fetchPostTypeDistribution(),
    placeholderData: keepPreviousData,
  });

  const total = (data?.post ?? 0) + (data?.event ?? 0) + (data?.review ?? 0);

  const chartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: ["#3C50E0", "#10B981", "#F59E0B"],
    labels: ["Posts", "Events", "Reviews"],
    legend: {
      show: true,
      position: "bottom",
      floating: false,
      fontSize: "12px",
      fontFamily: "Satoshi, sans-serif",
      fontWeight: 500,
      offsetY: -10,
      labels: {
        colors: "#64748B",
        useSeriesColors: false,
      },
      markers: {
        size: 6,
        offsetX: 0,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
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
              color: undefined,
              offsetY: -5,
              formatter: function (val: string) {
                return "Total";
              },
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              color: undefined,
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
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number) {
          return val + " posts";
        },
      },
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            height: 350,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const series = [data?.post ?? 0, data?.event ?? 0, data?.review ?? 0];

  return (
    <div className="h-full rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 flex flex-col overflow-hidden">
      <div className="mb-6">
        <h4 className="text-title-sm2 font-bold text-black dark:text-white">
          Post Type Distribution
        </h4>
        <p className="text-sm text-bodydark2 dark:text-bodydark">
          Distribution of posts by type
        </p>
      </div>

      <div className="flex-1 min-h-[350px] flex items-center justify-center overflow-hidden">
        {isPending || isFetching ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="relative w-[300px] h-[300px] animate-pulse">
              <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-boxdark-hover"></div>
              <div className="absolute inset-[15%] rounded-full bg-white dark:bg-boxdark-2"></div>
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="h-4 w-12 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-boxdark-hover rounded mx-auto"></div>
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-danger mb-2">
                Failed to load distribution data
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80"
              >
                Retry
              </button>
            </div>
          </div>
        ) : total === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-bodydark2 dark:text-bodydark mb-2">
                No data available
              </p>
            </div>
          </div>
        ) : (
          <div
            id="post-type-distribution-chart"
            className="w-full flex justify-center items-center overflow-hidden"
          >
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="donut"
              height={350}
            />
          </div>
        )}
      </div>

      {!isPending && !isFetching && data && total > 0 && (
        <div className="mt-4 flex flex-col gap-3 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="block h-3 w-3 rounded-full bg-[#3C50E0]"></span>
              <span className="text-sm font-medium text-black dark:text-white">
                Posts
              </span>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              {data.post ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="block h-3 w-3 rounded-full bg-[#10B981]"></span>
              <span className="text-sm font-medium text-black dark:text-white">
                Events
              </span>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              {data.event ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="block h-3 w-3 rounded-full bg-[#F59E0B]"></span>
              <span className="text-sm font-medium text-black dark:text-white">
                Reviews
              </span>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              {data.review ?? 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTypeDistributionChart;
