"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPostEngagement } from "@/api-services/post";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import moment from "moment";
import ChartSkeleton from "@/components/Loading/ChartSkeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface EngagementData {
  date: string;
  views: number;
  likes: number;
  reports: number;
}

const PostEngagementChart: React.FC = () => {
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["post-engagement"],
    queryFn: () => fetchPostEngagement(),
    placeholderData: keepPreviousData,
  });

  const processData = (engagementData: EngagementData[] | undefined) => {
    if (!engagementData || engagementData.length === 0) {
      return {
        categories: [],
        viewsSeries: [],
        likesSeries: [],
        reportsSeries: [],
      };
    }

    const categories = engagementData.map((item) =>
      moment(item.date).format("MMM DD")
    );

    const viewsSeries = engagementData.map((item) => item.views);
    const likesSeries = engagementData.map((item) => item.likes);
    const reportsSeries = engagementData.map((item) => item.reports);

    return { categories, viewsSeries, likesSeries, reportsSeries };
  };

  const { categories, viewsSeries, likesSeries, reportsSeries } =
    processData(data);

  const chartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ["#3C50E0", "#10B981", "#EF4444"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Count",
        style: {
          color: "#64748B",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      min: 0,
      forceNiceScale: true,
      tickAmount: 6,
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      floating: false,
      fontSize: "12px",
      fontFamily: "Satoshi, sans-serif",
      fontWeight: 500,
      //   offsetY: -5,
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
        horizontal: 15,
        vertical: 0,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="h-full rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 flex flex-col overflow-hidden">
      <div className="mb-6">
        <h4 className="text-title-sm2 font-bold text-black dark:text-white">
          Post Engagement
        </h4>
        <p className="text-sm text-bodydark2 dark:text-bodydark">
          Views, likes, and reports per day
        </p>
      </div>

      <div className="flex-1 min-h-[350px] overflow-hidden">
        {isPending || isFetching ? (
          <ChartSkeleton height={350} />
        ) : isError ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-danger mb-2">
                Failed to load engagement data
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data || viewsSeries.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-bodydark2 dark:text-bodydark mb-2">
                No data available
              </p>
            </div>
          </div>
        ) : (
          <div id="post-engagement-chart" className="w-full overflow-hidden">
            <ReactApexChart
              options={chartOptions}
              series={[
                { name: "Views", data: viewsSeries },
                { name: "Likes", data: likesSeries },
                { name: "Reports", data: reportsSeries },
              ]}
              type="line"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostEngagementChart;
