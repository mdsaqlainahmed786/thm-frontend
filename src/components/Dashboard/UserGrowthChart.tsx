"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUserGrowth } from "@/api-services/user";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import moment from "moment";
import ChartSkeleton from "@/components/Loading/ChartSkeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserGrowthData {
  date: string;
  count: number;
}

const UserGrowthChart: React.FC<{ accountType?: string }> = ({
  accountType,
}) => {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("monthly");

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["user-growth", viewMode, accountType],
    queryFn: () => fetchUserGrowth({ viewMode, accountType }),
    placeholderData: keepPreviousData,
  });

  const processData = (growthData: UserGrowthData[] | undefined) => {
    if (!growthData || growthData.length === 0) {
      return {
        categories: [],
        series: [],
      };
    }

    const categories = growthData.map((item) => {
      if (viewMode === "daily") {
        return moment(item.date).format("MMM DD");
      } else {
        return moment(item.date).format("MMM YYYY");
      }
    });

    const series = growthData.map((item) => item.count);

    return { categories, series };
  };

  const { categories, series } = processData(data);

  const chartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ["#3C50E0"],
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
        text: "New Users",
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
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number) {
          return val + " users";
        },
      },
    },
    legend: {
      show: false,
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

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("User Growth Data:", data);
      console.log("Categories:", categories);
      console.log("Series:", series);
    }
    if (isError) {
      console.error("User Growth Error:", error);
    }
  }, [data, categories, series, isError, error]);

  return (
    <div className="mb-10 rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-title-sm2 font-bold text-black dark:text-white">
            Users Growth
          </h4>
          <p className="text-sm text-bodydark2 dark:text-bodydark">
            {viewMode === "daily" ? "New users per day" : "Monthly user growth"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === "daily"
                ? "bg-primary text-white"
                : "bg-gray-2 text-black dark:bg-boxdark-hover dark:text-white"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === "monthly"
                ? "bg-primary text-white"
                : "bg-gray-2 text-black dark:bg-boxdark-hover dark:text-white"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="min-h-[350px]">
        {isPending || isFetching ? (
          <ChartSkeleton height={350} />
        ) : isError ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-danger mb-2">
                Failed to load user growth data
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data || series.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-sm text-bodydark2 dark:text-bodydark mb-2">
                No data available
              </p>
              <p className="text-xs text-bodydark2 dark:text-bodydark">
                Try switching between Daily and Monthly views
              </p>
            </div>
          </div>
        ) : (
          <div id="user-growth-chart" className="w-full">
            <ReactApexChart
              options={chartOptions}
              series={[{ name: "New Users", data: series }]}
              type="line"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGrowthChart;
