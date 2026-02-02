"use client";
import React, { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import CardDataStats from "@/components/Hotel/Common/CardDataStats";
import dynamic from "next/dynamic";
import ApexCharts, { ApexOptions } from "apexcharts";
import BookingTable from "@/components/Hotel/Common/Booking/Table";
import { fetchHotelDashboard } from "@/api-services/hotel";
import { PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import { useSession } from "next-auth/react";
import { fetchBookings } from "@/api-services/booking";
import moment from "moment";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const ReactLineChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const roomAvailabilityOptions: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#4169E1", "#505050"],
  labels: ["Available Room", "Booked Room"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
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
          width: "100%",
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

const reservationStatusOptions: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#6F42C1", "#C29500", "#C10808", "#505050"],
  // labels: ["Confirmed", "Pending", "Cancelled", "No-show"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
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
          width: "100%",
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
const Overview: React.FC<{}> = () => {
  const { data: session } = useSession();
  const isRestaurant = session?.user?.businessTypeName === "Restaurant";
  const durationArray = ["1h", "1d", "1w", "1m", "1y"];
  const [duration, setDuration] = useState(durationArray[1]);

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", duration],
    queryFn: () => fetchHotelDashboard({ duration }),
    placeholderData: keepPreviousData,
  });

  // Fetch bookings for reservation status distribution (restaurants only) and chart data
  const { data: bookingsData, isFetching: isFetchingBookings } = useQuery({
    queryKey: ["bookings", "status-distribution"],
    queryFn: () => fetchBookings({ pageNumber: 1, limit: 1000 }),
    placeholderData: keepPreviousData,
    enabled: isRestaurant, // Only fetch for restaurants
  });

  // Fetch bookings for chart data (all business types)
  const { data: chartBookingsData } = useQuery({
    queryKey: ["bookings", "chart-data", duration],
    queryFn: () => fetchBookings({ pageNumber: 1, limit: 1000 }),
    placeholderData: keepPreviousData,
  });

  const availableRooms = data?.availableRooms ?? 0;
  const totalRooms = data?.totalRooms ?? 0;

  // Calculate reservation status distribution for restaurants
  const reservationStatusCounts = useMemo(() => {
    if (!isRestaurant || !bookingsData?.data) {
      return { confirmed: 0, pending: 0, cancelled: 0, noShow: 0, total: 0 };
    }

    const bookings = bookingsData.data;
    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;
    let noShow = 0;

    bookings.forEach((booking) => {
      const status = booking.status?.toLowerCase() || "";
      if (status === "confirmed") {
        confirmed++;
      } else if (status === "pending" || status === "created") {
        pending++;
      } else if (status === "canceled" || status === "canceled by business") {
        cancelled++;
      } 
    });

    return {
      confirmed,
      pending,
      cancelled,
      noShow,
      total: confirmed + pending + cancelled + noShow,
    };
  }, [bookingsData, isRestaurant]);

  // Calculate reservation stats over time for the line chart
  const reservationChartData = useMemo(() => {
    if (!chartBookingsData?.data) {
      return {
        labels: [],
        series1: [],
        series2: [],
        totalReservations: 0,
      };
    }

    const bookings = chartBookingsData.data;
    const now = moment();
    let startDate: moment.Moment;
    let dateFormat: string;
    let dateStep: moment.unitOfTime.DurationConstructor;

    // Determine date range and format based on duration
    switch (duration) {
      case "1h":
        startDate = moment().subtract(24, "hours");
        dateFormat = "HH:mm";
        dateStep = "hour";
        break;
      case "1d":
        startDate = moment().subtract(7, "days");
        dateFormat = "DD MMM";
        dateStep = "day";
        break;
      case "1w":
        startDate = moment().subtract(4, "weeks");
        dateFormat = "DD MMM";
        dateStep = "week";
        break;
      case "1m":
        startDate = moment().subtract(6, "months");
        dateFormat = "MMM YY";
        dateStep = "month";
        break;
      case "1y":
        startDate = moment().subtract(12, "months");
        dateFormat = "MMM YY";
        dateStep = "month";
        break;
      default:
        startDate = moment().subtract(7, "days");
        dateFormat = "DD MMM";
        dateStep = "day";
    }

    // Initialize date buckets
    const dateBuckets: { [key: string]: { new: number; confirmed: number } } = {};
    const labels: string[] = [];
    const currentDate = moment(startDate).startOf(dateStep === "hour" ? "hour" : dateStep === "day" ? "day" : dateStep === "week" ? "week" : "month");

    while (currentDate.isSameOrBefore(now, dateStep === "hour" ? "hour" : dateStep === "day" ? "day" : dateStep === "week" ? "week" : "month")) {
      const dateKey = currentDate.format(dateFormat);
      labels.push(dateKey);
      dateBuckets[dateKey] = { new: 0, confirmed: 0 };
      currentDate.add(1, dateStep);
    }

    // Process bookings
    bookings.forEach((booking) => {
      const createdAt = moment(booking.createdAt);
      const checkInDate = booking.checkIn ? moment(booking.checkIn) : null;
      const status = booking.status?.toLowerCase() || "";

      // Format the booking date according to the current duration format
      let bookingDateKey: string | null = null;
      let checkInDateKey: string | null = null;

      // Format createdAt date
      if (dateStep === "hour") {
        bookingDateKey = createdAt.startOf("hour").format(dateFormat);
      } else if (dateStep === "day") {
        bookingDateKey = createdAt.startOf("day").format(dateFormat);
      } else if (dateStep === "week") {
        bookingDateKey = createdAt.startOf("week").format(dateFormat);
      } else if (dateStep === "month") {
        bookingDateKey = createdAt.startOf("month").format(dateFormat);
      }

      // Format checkIn date if available
      if (checkInDate) {
        if (dateStep === "hour") {
          checkInDateKey = checkInDate.startOf("hour").format(dateFormat);
        } else if (dateStep === "day") {
          checkInDateKey = checkInDate.startOf("day").format(dateFormat);
        } else if (dateStep === "week") {
          checkInDateKey = checkInDate.startOf("week").format(dateFormat);
        } else if (dateStep === "month") {
          checkInDateKey = checkInDate.startOf("month").format(dateFormat);
        }
      }

      // Count new reservations (by createdAt) - only if within date range
      if (bookingDateKey && dateBuckets[bookingDateKey] && createdAt.isSameOrAfter(startDate) && createdAt.isSameOrBefore(now)) {
        dateBuckets[bookingDateKey].new++;
      }

      // Count confirmed reservations (by checkIn date and status) - only if within date range
      if (status === "confirmed" && checkInDateKey && dateBuckets[checkInDateKey] && checkInDate && checkInDate.isSameOrAfter(startDate) && checkInDate.isSameOrBefore(now)) {
        dateBuckets[checkInDateKey].confirmed++;
      }
    });

    // Convert to arrays for chart
    const series1 = labels.map((label) => dateBuckets[label]?.new || 0);
    const series2 = labels.map((label) => dateBuckets[label]?.confirmed || 0);
    const totalReservations = bookings.length;

    return {
      labels,
      series1,
      series2,
      totalReservations,
    };
  }, [chartBookingsData, duration]);
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle>Overview</PageTitle>
        <div
          className="inline-flex rounded-lg shadow-xs dark:bg-primary/60 bg-primary/60 p-0.5"
          role="group"
        >
          {durationArray.map((text, index) => {
            return (
              <button
                onClick={() => setDuration(text)}
                type="button"
                key={index}
                className={`${
                  duration === text
                    ? "bg-[#4881F5] dark:bg-[#4881F5] border-[#4881F5]"
                    : "text-white/50  dark:text-white/50 border-transparent"
                } px-2.5 py-1.5 text-sm font-normal text-gray-900 border  rounded-lg hover:bg-primary/50 dark:text-white  dark:hover:bg-[#4881F5]/80 dark:hover:text-white hover:text-white`}
              >
                <span className="px-1.5">{text}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 ${
          isRestaurant ? "xl:grid-cols-3" : "xl:grid-cols-4"
        } 2xl:gap-7.5`}
      >
        <CardDataStats
          loading={isFetching || isPending ? true : false}
          title={isRestaurant ? "New Table Reservations" : "New Bookings"}
          count={data?.newBookings ?? 0}
          themeColor="#1E4EAE"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.3651 7.74742C21.8634 5.21576 19.9851 4.10742 17.3718 4.10742H7.12845C4.04845 4.10742 1.99512 5.64742 1.99512 9.24076V15.2491C1.99512 17.8391 3.05678 19.3558 4.80678 20.0091C5.06345 20.1024 5.34345 20.1841 5.63512 20.2308C6.10178 20.3358 6.60345 20.3824 7.12845 20.3824H17.3834C20.4634 20.3824 22.5168 18.8424 22.5168 15.2491V9.24076C22.5168 8.69242 22.4701 8.20242 22.3651 7.74742ZM6.45178 14.0008C6.45178 14.4791 6.05512 14.8758 5.57678 14.8758C5.09845 14.8758 4.70178 14.4791 4.70178 14.0008V10.5008C4.70178 10.0224 5.09845 9.62576 5.57678 9.62576C6.05512 9.62576 6.45178 10.0224 6.45178 10.5008V14.0008ZM12.2501 15.3308C10.5468 15.3308 9.17012 13.9541 9.17012 12.2508C9.17012 10.5474 10.5468 9.17076 12.2501 9.17076C13.9535 9.17076 15.3301 10.5474 15.3301 12.2508C15.3301 13.9541 13.9535 15.3308 12.2501 15.3308ZM19.7868 14.0008C19.7868 14.4791 19.3901 14.8758 18.9118 14.8758C18.4334 14.8758 18.0368 14.4791 18.0368 14.0008V10.5008C18.0368 10.0224 18.4334 9.62576 18.9118 9.62576C19.3901 9.62576 19.7868 10.0224 19.7868 10.5008V14.0008Z"
              fill="#F0F5FF"
            />
            <path
              d="M26.0164 12.74V18.7483C26.0164 22.3417 23.9631 23.8933 20.8714 23.8933H10.6281C9.75306 23.8933 8.9714 23.765 8.29473 23.5083C7.7464 23.31 7.26806 23.0183 6.88306 22.645C6.67306 22.4467 6.8364 22.1317 7.12806 22.1317H17.3714C21.6881 22.1317 24.2547 19.565 24.2547 15.26V9.24C24.2547 8.96 24.5697 8.785 24.7681 8.995C25.5614 9.835 26.0164 11.06 26.0164 12.74Z"
              fill="#F0F5FF"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          loading={isFetching || isPending ? true : false}
          title={isRestaurant ? "Today Reserved Tables" : "Today's Check In"}
          count={data?.todayCheckIn ?? 0}
          themeColor="#5221B5"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.8672 1.53711V26.4639L19.6328 24.1344V3.86674L11.8672 1.53711ZM6.50781 3.00831V11.7583H7.49219V3.99269H10.8828V3.00831H6.50781ZM20.6161 3.00995L20.6172 3.13437V4.75831H21.4922V3.00831L20.6161 3.00995ZM20.6172 5.74269V6.61769H21.4922V5.74269H20.6172ZM20.6172 7.60206V20.5083H21.4922V7.60206H20.6172ZM13.3438 12.688C13.7062 12.688 14 13.2756 14 14.0005C14 14.7254 13.7062 15.313 13.3438 15.313C12.9813 15.313 12.6875 14.7254 12.6875 14.0005C12.6875 13.2756 12.9813 12.688 13.3438 12.688ZM6.50781 16.2427V24.5005H7.49219V16.2427H6.50781ZM20.6172 21.4927V22.2583H21.4922V21.4927H20.6172ZM20.6172 23.2427V24.5005H21.4922V23.2427H20.6172ZM1.75 25.7583V26.7427H10.8828V25.7583H1.75ZM17.645 25.7583L14.3638 26.7427H26.25V25.7583H17.645Z"
              fill="white"
            />
            <path
              d="M10.0352 14L8.28513 12.25V13.3093H5.40215V14.6907H8.28513V15.75L10.0352 14Z"
              fill="white"
            />
          </svg>
        </CardDataStats>
        {!isRestaurant && (
          <CardDataStats
            loading={isFetching || isPending ? true : false}
            title={"Today's Check Out"}
            count={data?.todayCheckOut ?? 0}
            themeColor="#0A92CD"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8672 1.53906V26.4658L19.6328 24.1363V3.8687L11.8672 1.53906ZM6.50781 3.01027V11.7603H7.49219V3.99464H10.8828V3.01027H6.50781ZM20.6161 3.01191L20.6172 3.13632V4.76027H21.4922V3.01027L20.6161 3.01191ZM20.6172 5.74464V6.61964H21.4922V5.74464H20.6172ZM20.6172 7.60402V20.5103H21.4922V7.60402H20.6172ZM13.3438 12.69C13.7062 12.69 14 13.2776 14 14.0025C14 14.7273 13.7062 15.315 13.3438 15.315C12.9813 15.315 12.6875 14.7273 12.6875 14.0025C12.6875 13.2776 12.9813 12.69 13.3438 12.69ZM6.50781 16.2446V24.5025H7.49219V16.2446H6.50781ZM20.6172 21.4946V22.2603H21.4922V21.4946H20.6172ZM20.6172 23.2446V24.5025H21.4922V23.2446H20.6172ZM1.75 25.7603V26.7446H10.8828V25.7603H1.75ZM17.645 25.7603L14.3638 26.7446H26.25V25.7603H17.645Z"
                fill="white"
              />
              <path
                d="M5.40039 14L7.15042 12.25V13.3093H10.0334V14.6907H7.15042V15.75L5.40039 14Z"
                fill="white"
              />
            </svg>
          </CardDataStats>
        )}
        <CardDataStats
          loading={isFetching || isPending ? true : false}
          title={"Earnings"}
          count={data?.earnings ?? 0}
          themeColor="#CD500A"
        >
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.333 4.66602H8.66634C5.16634 4.66602 2.83301 6.41602 2.83301 10.4993V14.6527C2.83301 15.0844 3.27634 15.3527 3.66134 15.1777C4.80467 14.6527 6.12301 14.4544 7.51134 14.6994C10.5797 15.2477 12.8313 18.0943 12.7497 21.2094C12.738 21.6994 12.668 22.1777 12.5397 22.6444C12.4463 23.006 12.738 23.3444 13.1113 23.3444H20.333C23.833 23.3444 26.1663 21.5944 26.1663 17.511V10.4993C26.1663 6.41602 23.833 4.66602 20.333 4.66602ZM14.4997 16.916C12.8897 16.916 11.583 15.6093 11.583 13.9993C11.583 12.3893 12.8897 11.0827 14.4997 11.0827C16.1097 11.0827 17.4163 12.3893 17.4163 13.9993C17.4163 15.6093 16.1097 16.916 14.4997 16.916ZM22.958 16.3327C22.958 16.811 22.5613 17.2077 22.083 17.2077C21.6047 17.2077 21.208 16.811 21.208 16.3327V11.666C21.208 11.1877 21.6047 10.791 22.083 10.791C22.5613 10.791 22.958 11.1877 22.958 11.666V16.3327Z"
              fill="#F0FAFE"
            />
            <path
              d="M6.33366 16.334C4.87533 16.334 3.55699 17.0223 2.70533 18.0723C2.05199 18.8773 1.66699 19.8923 1.66699 21.0007C1.66699 23.579 3.76699 25.6673 6.33366 25.6673C8.36366 25.6673 10.102 24.3723 10.732 22.5523C10.907 22.074 11.0003 21.549 11.0003 21.0007C11.0003 18.434 8.91199 16.334 6.33366 16.334ZM9.08699 23.0306C9.06366 23.1006 9.01699 23.1706 8.97033 23.2173L8.13033 24.0457C8.02533 24.1623 7.88532 24.209 7.73366 24.209C7.58199 24.209 7.43033 24.1623 7.32533 24.0457C7.13866 23.8707 7.11533 23.5907 7.23199 23.3807H4.88699C4.14033 23.3807 3.53366 22.774 3.53366 22.0157V21.899C3.53366 21.5723 3.79033 21.3273 4.10533 21.3273C4.42033 21.3273 4.67699 21.5723 4.67699 21.899V22.0157C4.67699 22.144 4.77033 22.249 4.89866 22.249H7.24366C7.12699 22.0273 7.15033 21.759 7.33699 21.5723C7.55866 21.3507 7.92033 21.3507 8.13033 21.5723L8.97033 22.4123C9.01699 22.459 9.06366 22.529 9.09866 22.599C9.14533 22.7273 9.14533 22.8906 9.08699 23.0306ZM9.13366 20.1023C9.13366 20.429 8.87699 20.674 8.56199 20.674C8.24699 20.674 7.99033 20.429 7.99033 20.1023V19.9856C7.99033 19.8573 7.89699 19.7523 7.76866 19.7523H5.43533C5.55199 19.974 5.52866 20.2423 5.34199 20.429C5.23699 20.534 5.09699 20.5923 4.93366 20.5923C4.79366 20.5923 4.64199 20.534 4.53699 20.429L3.69699 19.589C3.65033 19.5423 3.60366 19.4723 3.56866 19.4023C3.52199 19.2623 3.52199 19.1107 3.56866 18.9707C3.60366 18.9123 3.63866 18.8307 3.69699 18.784L4.53699 17.9557C4.75866 17.7223 5.12033 17.7223 5.33033 17.9557C5.51699 18.1307 5.54033 18.4107 5.42366 18.6207H7.76866C8.51533 18.6207 9.12199 19.2273 9.12199 19.9856V20.1023H9.13366Z"
              fill="#F0FAFE"
            />
          </svg>
        </CardDataStats>
      </div>
      <div className="my-4 grid grid-cols-12 gap-4 md:my-6 md:gap-6 2xl:my-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-xl border border-theme-gray bg-theme-black px-5 py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5">
            <div className="mb-7.5 justify-between sm:flex">
              <div className="mb-2">
                <PageTitle>Top Reports</PageTitle>
              </div>
              <div className="mb-2">
                <div className="relative z-20 inline-block rounded bg-gray-2 dark:bg-boxdark">
                  <select
                    name="contentType"
                    id="contentType"
                    className="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-1 pl-3 pr-8 text-sm outline-none dark:border-strokedark"
                  >
                    <option value="" className="dark:bg-boxdark">
                      All
                    </option>
                    <option value="post" className="dark:bg-boxdark">
                      Post
                    </option>
                    <option value="user" className="dark:bg-boxdark">
                      User
                    </option>
                    <option value="comment" className="dark:bg-boxdark">
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
            <div className="flex flex-col">
              <ReactLineChart
                options={{
                  chart: {
                    type: "area",
                    height: 350,
                    zoom: {
                      enabled: true,
                    },
                    foreColor: "#ffffff",
                  },
                  dataLabels: {
                    enabled: true,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.3,
                      stops: [0, 90, 100],
                    },
                  },
                  colors: ["#3C50E0", "#10B981"],
                  title: {
                    text: reservationChartData.totalReservations.toString(),
                    align: "left",
                  },
                  subtitle: {
                    text: "Reservation Stats",
                    align: "left",
                  },
                  labels: reservationChartData.labels,
                  xaxis: {
                    type: "category",
                    labels: {
                      style: {
                        colors: "#ffffff",
                      },
                    },
                  },
                  yaxis: {
                    opposite: true,
                    labels: {
                      style: {
                        colors: "#ffffff",
                      },
                    },
                  },
                  legend: {
                    horizontalAlign: "left",
                    labels: {
                      colors: "#ffffff",
                    },
                  },
                }}
                series={[
                  {
                    name: "New Reservations",
                    data: reservationChartData.series1,
                  },
                  {
                    name: "Confirmed Reservations",
                    data: reservationChartData.series2,
                  },
                ]}
                type="area"
                height={"380px"}
              />
            </div>
          </div>
        </div>
        {isRestaurant ? (
          <div className="col-span-12 rounded-xl border border-theme-gray bg-theme-black px-5 pb-5 pt-7.5 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 xl:col-span-4">
            <div className="mb-3 justify-between gap-4 sm:flex">
              <PageTitle>Reservation Status Distribution</PageTitle>
            </div>
            <div className="mb-2">
              <div
                id="chartReservationStatus"
                className="mx-auto flex justify-center w-full"
              >
                <ReactApexChart
                  options={reservationStatusOptions}
                  series={[
                    reservationStatusCounts.confirmed,
                    reservationStatusCounts.pending,
                    reservationStatusCounts.cancelled,
                    reservationStatusCounts.noShow,
                  ]}
                  type="donut"
                />
              </div>
            </div>
            <div className="w-full px-8 flex flex-col gap-2 justify-center items-center">
              <p className="text-3xl font-bold text-white dark:text-white">
                {reservationStatusCounts.total}
              </p>
              <PageTitle>Total Reservations</PageTitle>
              <div className="mt-4 w-full flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6F42C1]"></div>
                    <span className="text-white/60">Confirmed</span>
                  </div>
                  <span className="text-white font-semibold">
                    {reservationStatusCounts.confirmed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C29500]"></div>
                    <span className="text-white/60">Pending</span>
                  </div>
                  <span className="text-white font-semibold">
                    {reservationStatusCounts.pending}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C10808]"></div>
                    <span className="text-white/60">Cancelled</span>
                  </div>
                  <span className="text-white font-semibold">
                    {reservationStatusCounts.cancelled}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  {/* <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#505050]"></div>
                    <span className="text-white/60">No-show</span>
                  </div> */}
                  
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-12 rounded-xl border border-theme-gray bg-theme-black px-5 pb-5 pt-7.5 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 xl:col-span-4">
            <div className="mb-3 justify-between gap-4 sm:flex">
              <PageTitle> Rooms Availability</PageTitle>
            </div>
            <div className="mb-2">
              <div id="chartThree" className="mx-auto flex justify-center w-full">
                <ReactApexChart
                  options={roomAvailabilityOptions}
                  series={[availableRooms, totalRooms - availableRooms]}
                  type="donut"
                />
              </div>
            </div>
            <div className="w-full px-8 flex flex-col gap-2 justify-center items-center">
              <p className="text-3xl font-bold text-white dark:text-white">
                {availableRooms}
              </p>
              <PageTitle>Available Room Today</PageTitle>
            </div>
          </div>
        )}
      </div>
      <div className="my-4 md:my-6 2xl:my-7.5">
        <div className="rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5">
          <div className="mb-4 flex justify-between">
            <PageTitle>Guest List</PageTitle>
            <div className="flex">
              {/* <Button.IconButton text="Add Coupon" variant="primary" onClick={() => {
                                setModal(true)
                                setEditMode(false);
                                setFormInputs(initialInputs)
                            }} icon={<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path></svg>} /> */}
            </div>
          </div>
          <BookingTable />
        </div>
      </div>
    </>
  );
};

export default Overview;
