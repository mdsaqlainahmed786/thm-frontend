"use client";
import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import CardDataStats from "@/components/CardDataStats";
import { Subscription } from "@/types/subscription";
import moment from "moment";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SubscriptionOverview: React.FC = () => {
  // Fetch all subscriptions for statistics calculation
  const fetchAllSubscriptions = async () => {
    try {
      const response = await apiRequest.get(`/admin/subscriptions`, {
        params: {
          query: "",
          documentLimit: 10000, // Large limit to get all subscriptions
          pageNumber: 1,
        },
      });
      if (response.status === 200 && response.data.status) {
        const responseData = response.data;
        return responseData as {
          data: Subscription[];
          pageNo: number;
          totalPages: number;
          totalResources: number;
        };
      } else {
        return null;
      }
    } catch (error) {
      handleClientApiErrors(error);
      return null;
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
    queryKey: ["subscription-statistics"],
    queryFn: () => fetchAllSubscriptions(),
    placeholderData: keepPreviousData,
  });

  // Calculate statistics from subscription data
  const calculateStatistics = () => {
    if (!data || !data.data) {
      return {
        totalRevenue: 0,
        totalSubscribers: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        newSubscriptionsLast7Days: 0,
        averageRevenuePerUser: 0,
        topPlanPurchased: null,
      };
    }

    const subscriptions = data.data;
    const now = moment();
    const startOfMonth = moment().startOf("month");
    const sevenDaysAgo = moment().subtract(7, "days");

    // Calculate total revenue (this month)
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      const createdAt = moment(sub.createdAt);
      if (
        createdAt.isAfter(startOfMonth) &&
        sub.ordersRef?.paymentDetail?.transactionAmount
      ) {
        return sum + (sub.ordersRef.paymentDetail.transactionAmount || 0);
      }
      return sum;
    }, 0);

    // Get unique subscribers
    const uniqueSubscribers = new Set(
      subscriptions.map((sub) => sub.userID).filter(Boolean)
    );

    // Count active vs expired subscriptions
    let activeSubscriptions = 0;
    let expiredSubscriptions = 0;

    subscriptions.forEach((sub) => {
      if (sub.isCancelled) {
        return;
      }
      if (sub.expirationDate && moment(sub.expirationDate).isAfter(now)) {
        activeSubscriptions++;
      } else {
        expiredSubscriptions++;
      }
    });

    // Count new subscriptions in last 7 days
    const newSubscriptionsLast7Days = subscriptions.filter((sub) => {
      const createdAt = moment(sub.createdAt);
      return createdAt.isAfter(sevenDaysAgo);
    }).length;

    // Calculate ARPU (Average Revenue per User)
    const totalRevenueAllTime = subscriptions.reduce((sum, sub) => {
      return sum + (sub.ordersRef?.paymentDetail?.transactionAmount || 0);
    }, 0);
    const averageRevenuePerUser =
      uniqueSubscribers.size > 0
        ? totalRevenueAllTime / uniqueSubscribers.size
        : 0;

    // Find top plan purchased
    const planCounts: {
      [key: string]: {
        count: number;
        name: string;
        price: number;
        duration: string;
      };
    } = {};

    subscriptions.forEach((sub) => {
      if (sub.subscriptionPlansRef) {
        const planId = sub.subscriptionPlansRef._id;
        if (!planCounts[planId]) {
          planCounts[planId] = {
            count: 0,
            name: sub.subscriptionPlansRef.name,
            price: sub.subscriptionPlansRef.price,
            duration: sub.subscriptionPlansRef.duration,
          };
        }
        planCounts[planId].count++;
      }
    });

    const topPlan = Object.values(planCounts).reduce(
      (top, current) => (current.count > top.count ? current : top),
      { count: 0, name: "", price: 0, duration: "" }
    );

    return {
      totalRevenue,
      totalSubscribers: uniqueSubscribers.size,
      activeSubscriptions,
      expiredSubscriptions,
      newSubscriptionsLast7Days,
      averageRevenuePerUser,
      topPlanPurchased:
        topPlan.count > 0
          ? {
              name: topPlan.name,
              price: topPlan.price,
              duration: topPlan.duration,
            }
          : null,
    };
  };

  const statistics = calculateStatistics();

  // Calculate chart data
  const calculateChartData = () => {
    if (!data || !data.data) {
      return {
        monthlyRevenue: { categories: [], series: [] },
        planDistribution: { labels: [], series: [] },
        statusBarChart: { categories: [], series: [] },
      };
    }

    const subscriptions = data.data;
    const now = moment();

    // 1. Monthly Revenue Line Chart - Last 12 months
    const monthlyRevenue: { [key: string]: number } = {};
    const months = [];
    const currentDate = moment();

    // Generate months from 11 months ago to current month (inclusive)
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, "months").startOf("month");
      const monthKey = month.format("MMM YYYY");
      months.push(monthKey);
      monthlyRevenue[monthKey] = 0;
    }

    subscriptions.forEach((sub) => {
      if (sub.ordersRef?.paymentDetail?.transactionAmount) {
        // Use subscription createdAt as it represents when payment was made
        const paymentDate = moment(sub.createdAt);

        // Only include payments that are not in the future
        if (
          paymentDate.isValid() &&
          paymentDate.isSameOrBefore(currentDate, "day")
        ) {
          const monthKey = paymentDate.format("MMM YYYY");
          if (monthlyRevenue.hasOwnProperty(monthKey)) {
            monthlyRevenue[monthKey] +=
              sub.ordersRef.paymentDetail.transactionAmount || 0;
          }
        }
      }
    });

    // 2. Plan Distribution Donut Chart
    const planCounts: { [key: string]: number } = {
      "Entry Plan": 0,
      Premium: 0,
      Business: 0,
    };

    subscriptions.forEach((sub) => {
      if (sub.subscriptionPlansRef) {
        const planName = (sub.subscriptionPlansRef.name || "").toLowerCase();
        const planType = (sub.subscriptionPlansRef.type || "").toLowerCase();
        const planLevel = (sub.subscriptionPlansRef.level || "").toLowerCase();

        // Categorize plans - check type first, then name, then level
        if (planType === "business" || planName.includes("business")) {
          planCounts["Business"]++;
        } else if (
          planLevel === "premium" ||
          planName.includes("premium") ||
          planName.includes("standard")
        ) {
          planCounts["Premium"]++;
        } else {
          // Default to Entry Plan (includes basic, entry, or any other)
          planCounts["Entry Plan"]++;
        }
      }
    });

    // 3. Active vs Expired vs Cancelled Bar Chart
    let activeCount = 0;
    let expiredCount = 0;
    let cancelledCount = 0;

    subscriptions.forEach((sub) => {
      if (sub.isCancelled) {
        cancelledCount++;
      } else if (
        sub.expirationDate &&
        moment(sub.expirationDate).isAfter(now)
      ) {
        activeCount++;
      } else {
        expiredCount++;
      }
    });

    return {
      monthlyRevenue: {
        categories: months,
        series: months.map((month) => monthlyRevenue[month] || 0),
      },
      planDistribution: {
        labels: Object.keys(planCounts),
        series: Object.values(planCounts),
      },
      statusBarChart: {
        categories: ["Active", "Expired", "Cancelled"],
        series: [activeCount, expiredCount, cancelledCount],
      },
    };
  };

  const chartData = calculateChartData();

  // Chart options
  const monthlyRevenueOptions: ApexOptions = {
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
    colors: ["#3C50E0"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#E5E7EB",
    },
    xaxis: {
      categories: chartData.monthlyRevenue.categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: function (val: number) {
          return "₹" + val.toLocaleString("en-IN");
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "₹" + val.toLocaleString("en-IN");
        },
      },
    },
  };

  const planDistributionOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: ["#3C50E0", "#0FADCF", "#FF6384"],
    labels: chartData.planDistribution.labels,
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
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 600,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 700,
              offsetY: 10,
              formatter: function (val: string) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 600,
              formatter: function () {
                return chartData.planDistribution.series
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

  const statusBarChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3C50E0", "#0FADCF", "#FF6384"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.statusBarChart.categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {/* Total Subscribers */}
        <CardDataStats
          loading={isFetching}
          title="Total Subscribers"
          total={statistics.totalSubscribers.toLocaleString("en-IN")}
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
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
        </CardDataStats>

        {/* Active Subscriptions */}
        <CardDataStats
          loading={isFetching}
          title="Active Subscriptions"
          total={statistics.activeSubscriptions.toLocaleString("en-IN")}
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
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM9.625 15.8125L4.8125 11L6.2375 9.575L9.625 12.9625L15.7625 6.825L17.1875 8.25L9.625 15.8125Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Expired Subscriptions */}
        <CardDataStats
          loading={isFetching}
          title="Expired Subscriptions"
          total={statistics.expiredSubscriptions.toLocaleString("en-IN")}
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
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM15.125 14.4375L13.7 15.8625L11 13.1625L8.3 15.8625L6.875 14.4375L9.575 11.7375L6.875 9.0375L8.3 7.6125L11 10.3125L13.7 7.6125L15.125 9.0375L12.425 11.7375L15.125 14.4375Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Top Plan Purchased */}
        <CardDataStats
          loading={isFetching}
          title="Top Plan Purchased"
          total={
            statistics.topPlanPurchased
              ? `${statistics.topPlanPurchased.name}: ₹${statistics.topPlanPurchased.price}/${statistics.topPlanPurchased.duration}`
              : "N/A"
          }
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
              d="M11 0L13.75 7.5625L22 8.25L16.5 13.75L17.875 22L11 18.125L4.125 22L5.5 13.75L0 8.25L8.25 7.5625L11 0Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Line Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Monthly Revenue
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Revenue growth over the last 12 months
            </p>
          </div>
          {isFetching ? (
            <div className="h-[350px] flex items-center justify-center">
              <div className="animate-pulse text-body dark:text-bodydark">
                Loading chart...
              </div>
            </div>
          ) : (
            <ReactApexChart
              options={monthlyRevenueOptions}
              series={[
                {
                  name: "Revenue",
                  data: chartData.monthlyRevenue.series,
                },
              ]}
              type="line"
              height={350}
            />
          )}
        </div>

        {/* Plan Distribution Donut Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Plan Distribution
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Distribution of subscription plans
            </p>
          </div>
          {isFetching ? (
            <div className="h-[350px] flex items-center justify-center mx-auto">
              <div className="animate-pulse text-body dark:text-bodydark">
                Loading chart...
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center mx-auto">
            <ReactApexChart
              options={planDistributionOptions}
              series={chartData.planDistribution.series}
              type="donut"
              height={350}
            />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOverview;
