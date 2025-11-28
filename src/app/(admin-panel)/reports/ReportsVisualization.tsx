"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchReports } from "@/api-services/report";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import CardDataStats from "@/components/CardDataStats";
import { UserDetailedView } from "@/components/Profile";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ReportsVisualization = () => {
  // Fetch all reports for statistics
  const { isPending, isError, error, data, isFetching } = useQuery({
    queryKey: ["reports-visualization"],
    queryFn: () =>
      fetchReports({
        query: "",
        documentLimit: 10000, // Large limit to get all reports for statistics
        pageNumber: 1,
        contentType: "",
      }),
    placeholderData: keepPreviousData,
  });

  // Calculate statistics and process data for visualizations
  const statistics = useMemo(() => {
    if (!data || !data.data) {
      return {
        totalReportsToday: 0,
        pendingReports: 0,
        mostCommonReason: "N/A",
        topOffendingUser: null,
        reportsThisMonth: 0,
      };
    }

    const reports = data.data;
    const now = moment();
    const startOfToday = moment().startOf("day");
    const startOfMonth = moment().startOf("month");

    // Total Reports Today
    const totalReportsToday = reports.filter((report) => {
      const reportDate = moment(report.createdAt);
      return reportDate.isSameOrAfter(startOfToday);
    }).length;

    // Pending Reports (all reports are considered pending)
    const pendingReports = reports.length;

    // Most Common Reason
    const reasonCounts: { [key: string]: number } = {};
    reports.forEach((report) => {
      const reason = report.reason || "Other";
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    const mostCommonReason =
      Object.keys(reasonCounts).length > 0
        ? Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0][0]
        : "N/A";

    // Top Offending User (user/content with most reports)
    const userReportCounts: {
      [key: string]: {
        count: number;
        userId: string;
        name: string;
        username: string;
        accountType: string;
        image?: string;
        contentTypes: Set<string>;
      };
    } = {};

    reports.forEach((report) => {
      // Only track actual users (when contentType is "user")
      // For posts and comments, we don't have user data in the report structure
      if (report.contentType === "user" && report.usersRef) {
        const userId = report.usersRef._id;
        const userName =
          report.usersRef.name || report.usersRef.username || "Unknown";
        const username = report.usersRef.username || "Unknown";
        const accountType = report.usersRef.accountType || "individual";
        const image =
          report.usersRef.accountType === "business"
            ? report.usersRef.businessProfileRef?.profilePic?.small
            : report.usersRef?.profilePic?.small;

        if (!userReportCounts[userId]) {
          userReportCounts[userId] = {
            count: 0,
            userId,
            name: userName,
            username,
            accountType,
            image,
            contentTypes: new Set(),
          };
        }
        userReportCounts[userId].count++;
        userReportCounts[userId].contentTypes.add(report.contentType);
      }
    });

    const topOffendingUserData =
      Object.keys(userReportCounts).length > 0
        ? Object.values(userReportCounts).sort((a, b) => b.count - a.count)[0]
        : null;

    // Reports This Month
    const reportsThisMonth = reports.filter((report) => {
      const reportDate = moment(report.createdAt);
      return reportDate.isSameOrAfter(startOfMonth);
    }).length;

    return {
      totalReportsToday,
      pendingReports,
      mostCommonReason,
      topOffendingUser: topOffendingUserData,
      reportsThisMonth,
    };
  }, [data]);

  // Process data for visualizations
  const chartData = useMemo(() => {
    if (!data || !data.data) {
      return {
        reasonBreakdown: {
          labels: [],
          series: [],
        },
        reportsOverTime: {
          categories: [],
          series: [],
        },
      };
    }

    const reports = data.data;
    const now = moment();
    const thirtyDaysAgo = moment().subtract(30, "days");

    // 1. Reason Breakdown - Count reports by reason
    const reasonCounts: { [key: string]: number } = {};
    const reasonLabels = [
      "False Information",
      "Spam",
      "Inappropriate Content",
      "Bullying Or Unwanted Contact",
      "Harassment",
      "Other",
    ];

    // Initialize all reasons with 0
    reasonLabels.forEach((label) => {
      reasonCounts[label] = 0;
    });

    reports.forEach((report) => {
      const reason = report.reason || "Other";
      // Normalize reason names to match our labels
      let normalizedReason = reason;
      if (reason.toLowerCase().includes("false")) {
        normalizedReason = "False Information";
      } else if (reason.toLowerCase().includes("spam")) {
        normalizedReason = "Spam";
      } else if (reason.toLowerCase().includes("inappropriate")) {
        normalizedReason = "Inappropriate Content";
      } else if (
        reason.toLowerCase().includes("bullying") ||
        reason.toLowerCase().includes("unwanted")
      ) {
        normalizedReason = "Bullying Or Unwanted Contact";
      } else if (reason.toLowerCase().includes("harassment")) {
        normalizedReason = "Harassment";
      } else if (!reasonLabels.includes(reason)) {
        normalizedReason = "Other";
      }

      if (reasonCounts.hasOwnProperty(normalizedReason)) {
        reasonCounts[normalizedReason]++;
      } else {
        reasonCounts["Other"]++;
      }
    });

    // 2. Reports Over Time - Last 30 days
    const dailyCounts: { [key: string]: number } = {};
    const days = [];

    // Generate all days from 30 days ago to today
    for (let i = 30; i >= 0; i--) {
      const day = moment().subtract(i, "days");
      const dayKey = day.format("MMM DD");
      days.push(dayKey);
      dailyCounts[dayKey] = 0;
    }

    reports.forEach((report) => {
      const reportDate = moment(report.createdAt);
      if (
        reportDate.isAfter(thirtyDaysAgo) ||
        reportDate.isSame(thirtyDaysAgo, "day")
      ) {
        const dayKey = reportDate.format("MMM DD");
        if (dailyCounts.hasOwnProperty(dayKey)) {
          dailyCounts[dayKey]++;
        }
      }
    });

    return {
      reasonBreakdown: {
        labels: reasonLabels.filter((label) => reasonCounts[label] > 0),
        series: reasonLabels
          .filter((label) => reasonCounts[label] > 0)
          .map((label) => reasonCounts[label]),
      },
      reportsOverTime: {
        categories: days,
        series: days.map((day) => dailyCounts[day] || 0),
      },
    };
  }, [data]);

  // Doughnut Chart Options for Report Reasons
  const reasonBreakdownOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: ["#3C50E0", "#0FADCF", "#FF6384", "#10B981", "#F59E0B", "#8B5CF6"],
    labels: chartData.reasonBreakdown.labels,
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Satoshi, sans-serif",
      fontWeight: 500,
      labels: {
        colors: "#6B7280",
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
              offsetY: -10,
              color: "#6B7280",
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              offsetY: 10,
              color: "#1F2937",
              formatter: function (val: string) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total Reports",
              fontSize: "14px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 600,
              color: "#6B7280",
              formatter: function () {
                return chartData.reasonBreakdown.series
                  .reduce((a, b) => a + b, 0)
                  .toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val: number) {
          return val.toString();
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
  };

  // Line Chart Options for Reports Over Time - Enhanced for visibility
  const reportsOverTimeOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#0C4A6E"], // Dark blue instead of shady blue
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 4, // Thicker line for better visibility
      lineCap: "round",
    },
    markers: {
      size: 5, // Add markers to make data points visible
      strokeWidth: 2,
      strokeColors: ["#0C4A6E"], // Dark blue to match line
      hover: {
        size: 7,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      borderColor: "#E5E7EB",
      xaxis: {
        lines: {
          show: false, // Hide vertical lines
        },
      },
      yaxis: {
        lines: {
          show: true, // Show horizontal lines
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      categories: chartData.reportsOverTime.categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: false,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      decimalsInFloat: 0, // Ensure integer values
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: function (val: number) {
          // Only show integer values
          return Math.floor(val).toString();
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val: number) {
          return val.toString() + " reports";
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#075985"], // Dark blue for gradient
        inverseColors: false,
        opacityFrom: 0.8, // Higher opacity for better visibility
        opacityTo: 0.2, // Higher opacity for better visibility
        stops: [0, 100],
      },
    },
  };

  if (isError) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <p className="text-red-500 dark:text-red-400">
          Error loading visualization data
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
        {/* Total Reports Today */}
        <CardDataStats
          loading={isFetching}
          title="Total Reports Today"
          total={statistics.totalReportsToday.toLocaleString("en-IN")}
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM11 20C6.0375 20 2 15.9625 2 11C2 6.0375 6.0375 2 11 2C15.9625 2 20 6.0375 20 11C20 15.9625 15.9625 20 11 20ZM10.5 5.5V11.5H15.5V13.5H10.5V5.5Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Pending Reports */}
        <CardDataStats
          loading={isFetching}
          title="Pending Reports"
          total={statistics.pendingReports.toLocaleString("en-IN")}
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM11 20C6.0375 20 2 15.9625 2 11C2 6.0375 6.0375 2 11 2C15.9625 2 20 6.0375 20 11C20 15.9625 15.9625 20 11 20ZM9.5 6.5V9.5H12.5V11.5H9.5V14.5H7.5V6.5H9.5ZM14.5 6.5V14.5H12.5V6.5H14.5Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Most Common Reason */}
        <CardDataStats
          loading={isFetching}
          title="Most Common Reason"
          total={statistics.mostCommonReason}
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM11 20C6.0375 20 2 15.9625 2 11C2 6.0375 6.0375 2 11 2C15.9625 2 20 6.0375 20 11C20 15.9625 15.9625 20 11 20ZM10 5V7H12V5H10ZM10 9V17H12V9H10Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Top Offending User */}
        <div
          className={`group relative overflow-hidden rounded-lg border border-stroke/50 bg-white px-7.5 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-boxdark dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] dark:hover:bg-boxdark-hover dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)] ${
            isFetching ? "animate-pulse" : ""
          }`}
        >
          {/* Subtle glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5 dark:to-transparent" />

          {/* Icon container */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_2px_4px_rgba(99,102,241,0.1)] dark:from-primary/20 dark:to-primary/10 dark:shadow-[0_2px_4px_rgba(99,102,241,0.2)]">
            <svg
              className="fill-primary dark:fill-white scale-110"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                fill=""
              />
              <path
                d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                fill=""
              />
              <path
                d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                fill=""
              />
            </svg>
          </div>

          <div className="relative mt-5">
            <span className="text-sm font-medium text-body dark:text-bodydark">
              Top Offending User
            </span>
            {isFetching ? (
              <div className="mt-3 space-y-2">
                <div className="h-16 w-full rounded-md bg-gray-200 dark:bg-boxdark-hover/50 animate-pulse"></div>
              </div>
            ) : statistics.topOffendingUser ? (
              <div className="mt-3 space-y-2">
                <UserDetailedView
                  id={statistics.topOffendingUser.userId}
                  name={statistics.topOffendingUser.name}
                  username={statistics.topOffendingUser.username}
                  accountType={statistics.topOffendingUser.accountType}
                  image={statistics.topOffendingUser.image}
                />
                {/* <div className="mt-2">
                  <p className="text-xs text-body dark:text-bodydark mb-1">
                    Reported for:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(statistics.topOffendingUser.contentTypes).map(
                      (contentType: string) => (
                        <span
                          key={contentType}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary"
                        >
                          {contentType.charAt(0).toUpperCase() +
                            contentType.slice(1)}
                        </span>
                      )
                    )}
                  </div>
                </div> */}
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-title-md font-bold text-black dark:text-white">
                  N/A
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reports This Month */}
        <CardDataStats
          loading={isFetching}
          title="Reports This Month"
          total={statistics.reportsThisMonth.toLocaleString("en-IN")}
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM11 20C6.0375 20 2 15.9625 2 11C2 6.0375 6.0375 2 11 2C15.9625 2 20 6.0375 20 11C20 15.9625 15.9625 20 11 20ZM10 5V7H12V5H10ZM10 9V17H12V9H10Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Report Reasons Breakdown - Doughnut Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Report Reasons Breakdown
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Distribution of reports by reason
            </p>
          </div>
          {isFetching ? (
            <div className="h-[350px] flex flex-col items-center justify-center mx-auto relative">
              {/* Skeleton for Donut Chart */}
              <div className="relative w-[280px] h-[280px]">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-strokedark animate-pulse"></div>
                <div className="absolute inset-[30%] rounded-full bg-white dark:bg-boxdark"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-boxdark-hover rounded mb-2 animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center mx-auto">
              {chartData.reasonBreakdown.series.length > 0 ? (
                <ReactApexChart
                  options={reasonBreakdownOptions}
                  series={chartData.reasonBreakdown.series}
                  type="donut"
                  height={350}
                />
              ) : (
                <div className="text-center text-body dark:text-bodydark">
                  <p>No report data available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reports Over Time - Line Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Reports Over Time
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Daily report count for the last 30 days
            </p>
          </div>
          {isFetching ? (
            <div className="h-[350px] relative">
              {/* Skeleton for Line Chart */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex flex-col gap-3 h-full">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-strokedark"></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-3 w-12 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M 5,80 Q 20,60 35,50 T 65,40 T 95,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="text-gray-300 dark:text-strokedark animate-pulse"
                  opacity="0.3"
                />
              </svg>
            </div>
          ) : (
            <ReactApexChart
              options={reportsOverTimeOptions}
              series={[
                {
                  name: "Reports",
                  data: chartData.reportsOverTime.series,
                },
              ]}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsVisualization;
