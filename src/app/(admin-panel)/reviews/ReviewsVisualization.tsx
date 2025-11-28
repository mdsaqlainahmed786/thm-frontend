"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchReviews } from "@/api-services/review";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import CardDataStats from "@/components/CardDataStats";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ReviewsVisualization = () => {
  // Fetch all reviews for statistics
  const { isPending, isError, error, data, isFetching } = useQuery({
    queryKey: ["reviews-visualization"],
    queryFn: () =>
      fetchReviews({
        query: "",
        documentLimit: 10000, // Large limit to get all reviews for statistics
        pageNumber: 1,
      }),
    placeholderData: keepPreviousData,
  });

  // Calculate statistics and process data for visualizations
  const statistics = useMemo(() => {
    if (!data || !data.data) {
      return {
        totalReviews: 0,
        averageRating: 0,
        publishedReviews: 0,
        reviewsThisMonth: 0,
      };
    }

    const reviews = data.data;
    const startOfMonth = moment().startOf("month");

    // Total Reviews
    const totalReviews = reviews.length;

    // Average Rating
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Published Reviews
    const publishedReviews = reviews.filter(
      (review) => review.isPublished
    ).length;

    // Reviews This Month
    const reviewsThisMonth = reviews.filter((review) => {
      const reviewDate = moment(review.createdAt);
      return reviewDate.isSameOrAfter(startOfMonth);
    }).length;

    return {
      totalReviews,
      averageRating,
      publishedReviews,
      reviewsThisMonth,
    };
  }, [data]);

  // Process data for visualizations
  const chartData = useMemo(() => {
    if (!data || !data.data) {
      return {
        starDistribution: {
          labels: [],
          series: [],
          percentages: [],
        },
        topBusinesses: {
          labels: [],
          series: [],
        },
      };
    }

    const reviews = data.data;

    // 1. Star Distribution - Count reviews by rating (1-5 stars)
    const ratingCounts: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      const rating = Math.round(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    const totalReviews = reviews.length;
    const starLabels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    const starSeries = [
      ratingCounts[1],
      ratingCounts[2],
      ratingCounts[3],
      ratingCounts[4],
      ratingCounts[5],
    ];
    const starPercentages = starSeries.map((count) =>
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    );

    // 2. Top Reviewed Businesses - Businesses with most reviews
    const businessCounts: {
      [key: string]: {
        count: number;
        name: string;
      };
    } = {};

    reviews.forEach((review) => {
      const businessRef = review.reviewedBusinessProfileRef;
      if (businessRef && businessRef._id) {
        const businessId = businessRef._id;
        const businessName =
          businessRef.name || businessRef.username || "Unknown Business";

        if (!businessCounts[businessId]) {
          businessCounts[businessId] = {
            count: 0,
            name: businessName,
          };
        }
        businessCounts[businessId].count++;
      }
    });

    // Sort businesses by review count and take top 10
    const topBusinesses = Object.values(businessCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      starDistribution: {
        labels: starLabels,
        series: starSeries,
        percentages: starPercentages,
      },
      topBusinesses: {
        labels: topBusinesses.map((b) => b.name),
        series: topBusinesses.map((b) => b.count),
      },
    };
  }, [data]);

  // Bar Chart Options for Star Distribution
  const starDistributionOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#F59E0B"], // Gold color for stars
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#6B7280"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.starDistribution.labels,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      forceNiceScale: true,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: function (val: number) {
          return Math.floor(val) + "%";
        },
      },
      title: {
        text: "Percentage",
        style: {
          color: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val: number, { seriesIndex, dataPointIndex }) {
          const count = chartData.starDistribution.series[dataPointIndex];
          const percentage =
            chartData.starDistribution.percentages[dataPointIndex];
          return `${count} reviews (${percentage}%)`;
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      borderColor: "#E5E7EB",
    },
  };

  // Horizontal Bar Chart Options for Top Reviewed Businesses
  const topBusinessesOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 400,
      toolbar: {
        show: false,
      },
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toString();
      },
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: "12px",
        colors: ["#1F2937"],
        fontWeight: 600,
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: chartData.topBusinesses.labels,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
      title: {
        text: "Number of Reviews",
        style: {
          color: "#6B7280",
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
        maxWidth: 200,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val: number) {
          return val.toString() + " reviews";
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      borderColor: "#E5E7EB",
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Reviews */}
        <CardDataStats
          loading={isFetching}
          title="Total Reviews"
          total={statistics.totalReviews.toLocaleString("en-IN")}
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
              d="M11 0L13.09 7.26L21 8.18L15 13.14L16.18 21.02L11 17.77L5.82 21.02L7 13.14L1 8.18L8.91 7.26L11 0Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Average Rating */}
        <CardDataStats
          loading={isFetching}
          title="Average Rating"
          total={statistics.averageRating.toFixed(1)}
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
              d="M11 0L13.09 7.26L21 8.18L15 13.14L16.18 21.02L11 17.77L5.82 21.02L7 13.14L1 8.18L8.91 7.26L11 0Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Published Reviews */}
        <CardDataStats
          loading={isFetching}
          title="Published Reviews"
          total={statistics.publishedReviews.toLocaleString("en-IN")}
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
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM9 16L4 11L5.41 9.59L9 13.17L16.59 5.58L18 7L9 16Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        {/* Reviews This Month */}
        <CardDataStats
          loading={isFetching}
          title="Reviews This Month"
          total={statistics.reviewsThisMonth.toLocaleString("en-IN")}
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
              d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM11 20C6.0375 20 2 15.9625 2 11C2 6.0375 6.0375 2 11 2C15.9625 2 20 6.0375 20 11C20 15.9625 15.9625 20 11 20ZM10 5V11H15V13H10V5Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Star Distribution - Bar Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Average Rating Visualization
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Star distribution percentage
            </p>
          </div>
          {isFetching ? (
            <div className="h-[350px] flex flex-col items-center justify-center mx-auto relative">
              <div className="space-y-4 w-full">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-8 w-24 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center mx-auto">
              {chartData.starDistribution.series.length > 0 &&
              chartData.starDistribution.series.some((val) => val > 0) ? (
                <ReactApexChart
                  options={starDistributionOptions}
                  series={[
                    {
                      name: "Percentage",
                      data: chartData.starDistribution.percentages,
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              ) : (
                <div className="text-center text-body dark:text-bodydark">
                  <p>No review data available</p>
                </div>
              )}
            </div>
          )}
          {/* Text Summary of Star Distribution */}
          {!isFetching &&
          chartData.starDistribution.series.length > 0 &&
          chartData.starDistribution.series.some((val) => val > 0) ? (
            <div className="mt-4 pt-4 border-t border-stroke dark:border-strokedark">
              <div className="space-y-2">
                {chartData.starDistribution.labels
                  .map((label, index) => ({
                    label,
                    percentage: chartData.starDistribution.percentages[index],
                    count: chartData.starDistribution.series[index],
                  }))
                  .filter((item) => item.count > 0)
                  .reverse() // Show 5 stars first
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-black dark:text-white font-medium">
                        {item.label}
                      </span>
                      <span className="text-body dark:text-bodydark">
                        {item.percentage}% ({item.count} reviews)
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Top Reviewed Businesses - Horizontal Bar Chart */}
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-4">
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Top Reviewed Businesses
            </h4>
            <p className="text-sm text-body dark:text-bodydark">
              Businesses with the most reviews
            </p>
          </div>
          {isFetching ? (
            <div className="h-[400px] relative">
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex flex-col gap-4 h-full">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-6 w-48 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                      <div className="flex-1 h-6 bg-gray-200 dark:bg-boxdark-hover rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center mx-auto">
              {chartData.topBusinesses.series.length > 0 ? (
                <ReactApexChart
                  options={topBusinessesOptions}
                  series={[
                    {
                      name: "Reviews",
                      data: chartData.topBusinesses.series,
                    },
                  ]}
                  type="bar"
                  height={400}
                />
              ) : (
                <div className="text-center text-body dark:text-bodydark">
                  <p>No business review data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsVisualization;
