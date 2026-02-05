"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchBookings, changeBookingStatus } from "@/api-services/booking";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { DefaultProfilePic } from "@/components/Profile";
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import SVG from "@/components/SVG";
import { useRouter } from "next/navigation";
import StatusButton from "../StatusButton";
import StatusDropDown from "../StatusButton/dropdown";
import { useSession } from "next-auth/react";

interface BookingTableProps {
  timelineFilter?: string;
  checkEvent?: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ 
  timelineFilter = "1w",
  checkEvent = "Today Check In"
}) => {
  const { data: session } = useSession();
  const isRestaurant = session?.user?.businessTypeName === "Restaurant";
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [toggleIndex, setToggleIndex] = useState("");

  // Calculate date filters based on timelineFilter and checkEvent
  const dateFilters = useMemo(() => {
    const today = moment().startOf("day");
    const filters: { [key: string]: string } = {};

    // Apply check event filter (Today Check In or Today Check Out)
    // These filters take priority and show bookings for today
    if (checkEvent === "Today Check In") {
      // Filter by check-in date being today
      filters.checkIn = today.format("YYYY-MM-DD");
      return filters;
    } else if (checkEvent === "Today Check Out") {
      // Filter by check-out date being today
      filters.checkOut = today.format("YYYY-MM-DD");
      return filters;
    }

    // If no check event filter, apply timeline filter for date range
    // Calculate date range based on timeline filter
    let startDate: moment.Moment;
    let endDate: moment.Moment = moment().endOf("day");

    switch (timelineFilter) {
      case "1h":
        startDate = moment().subtract(1, "hour").startOf("hour");
        break;
      case "1d":
        startDate = moment().subtract(1, "day").startOf("day");
        break;
      case "1w":
        startDate = moment().subtract(1, "week").startOf("day");
        break;
      case "1m":
        startDate = moment().subtract(1, "month").startOf("day");
        break;
      case "1y":
        startDate = moment().subtract(1, "year").startOf("day");
        break;
      default:
        startDate = moment().subtract(1, "week").startOf("day");
    }

    // Add date range filters for check-in dates within the timeline
    filters.startDate = startDate.format("YYYY-MM-DD");
    filters.endDate = endDate.format("YYYY-MM-DD");

    return filters;
  }, [timelineFilter, checkEvent]);

  // Reset page number when filters change
  useEffect(() => {
    setPageNo(1);
  }, [timelineFilter, checkEvent]);

  const { isPending, data, isFetching, refetch } = useQuery({
    queryKey: ["bookings", pageNo, timelineFilter, checkEvent],
    queryFn: () => fetchBookings({ 
      pageNumber: pageNo,
      ...dateFilters
    }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);

  const handleStatusChange = async (status: string, bookingID: string) => {
    try {
      setToggleIndex("");
      await changeBookingStatus(bookingID, status);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-theme-primary bg-theme-card p-4 animate-shimmer">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-theme-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-theme-secondary" />
              <div className="h-5 w-32 rounded bg-theme-secondary" />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="h-4 w-full rounded bg-theme-secondary" />
                <div className="h-4 w-full rounded bg-theme-secondary" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-theme-secondary mb-4">
        <svg
          className="h-8 w-8 text-theme-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-body-lg font-semibold text-theme-primary mb-1">
        No bookings found
      </h3>
      <p className="text-body-sm text-theme-secondary text-center">
        New bookings will appear here when customers make reservations.
      </p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {isFetching || isPending ? (
          <LoadingSkeleton />
        ) : (data?.data?.length ?? 0) === 0 ? (
          <EmptyState />
        ) : (
          data?.data?.map((booking) => (
            <div
              key={booking._id}
              className="rounded-lg border border-theme-primary bg-theme-card p-4 transition-all duration-200 hover:shadow-theme-md"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Image
                  src={booking?.usersRef?.profilePic?.small ?? DefaultProfilePic}
                  width={44}
                  height={44}
                  alt=""
                  className="h-11 w-11 rounded-full flex-shrink-0 object-cover ring-2 ring-theme-primary"
                />

                <div className="min-w-0 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-body-sm text-theme-tertiary truncate">
                        #{booking?.bookingID}
                      </p>
                      <p className="text-body-md font-semibold text-theme-primary truncate">
                        {booking?.usersRef?.name ?? "Guest"}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {["created", "pending"].includes(booking.status) ? (
                        <div className="relative">
                          <StatusButton
                            status={booking.status}
                            isToggled={toggleIndex === booking._id}
                            onClick={() =>
                              toggleIndex === booking._id
                                ? setToggleIndex("")
                                : setToggleIndex(booking._id)
                            }
                          />
                          <StatusDropDown
                            open={booking._id === toggleIndex}
                            onStatusChange={(status) =>
                              handleStatusChange(status, booking._id)
                            }
                          />
                        </div>
                      ) : (
                        <StatusButton status={booking.status} disabled={true} />
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-body-sm">
                    <div className="min-w-0">
                      <p className="text-theme-tertiary text-label-sm">Phone</p>
                      <p className="text-theme-primary truncate">
                        {(booking?.usersRef?.dialCode ?? "") +
                          " " +
                          (booking?.usersRef?.phoneNumber ?? "")}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-theme-tertiary text-label-sm">Created</p>
                      <p className="text-theme-primary truncate">
                        {moment(booking.createdAt).fromNow()}
                      </p>
                    </div>

                    {isRestaurant ? (
                      <div className="min-w-0">
                        <p className="text-theme-tertiary text-label-sm">Table Booked</p>
                        <p className="text-theme-primary truncate">
                          {booking?.checkIn
                            ? moment.utc(booking.checkIn).format("MMM DD, YYYY")
                            : "-"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0">
                          <p className="text-theme-tertiary text-label-sm">Check In</p>
                          <p className="text-theme-primary truncate">
                            {booking?.checkIn
                              ? moment.utc(booking.checkIn).format("MMM DD, YYYY")
                              : "-"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-theme-tertiary text-label-sm">Check Out</p>
                          <p className="text-theme-primary truncate">
                            {booking?.checkOut
                              ? moment.utc(booking.checkOut).format("MMM DD, YYYY")
                              : "-"}
                          </p>
                        </div>
                        <div className="min-w-0 col-span-2">
                          <p className="text-theme-tertiary text-label-sm">Room Type</p>
                          <p className="text-theme-primary truncate capitalize">
                            {booking?.roomsRef?.roomType ?? "-"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  {!isRestaurant && (
                    <div className="mt-4">
                      <Button.Hotel.View
                        name="View Details"
                        svg={<SVG.Eye />}
                        onClick={() =>
                          router.push(`/hotels/booking-management/${booking?._id}`)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-theme-primary">
        <div className="overflow-x-auto thm-scrollbar">
          <table className="w-full min-w-[900px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-theme-secondary border-b-2 border-brand-primary/20">
                <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[200px]">
                  Guest Name
                </th>
                <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[130px]">
                  Phone
                </th>
                <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[110px]">
                  Date Order
                </th>
                {isRestaurant ? (
                  <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[110px]">
                    Table Booked
                  </th>
                ) : (
                  <>
                    <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[110px]">
                      Check In
                    </th>
                    <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[110px]">
                      Check Out
                    </th>
                    <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[100px]">
                      Room Type
                    </th>
                  </>
                )}
                <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[140px]">
                  Created
                </th>
                <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[130px]">
                  Status
                </th>
                {!isRestaurant && (
                  <th className="px-4 py-3.5 text-left text-label-sm font-semibold text-theme-secondary uppercase tracking-wider min-w-[100px]">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-theme-secondary">
              {isFetching || isPending ? (
                <tr>
                  <td colSpan={isRestaurant ? 6 : 9} className="py-8">
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
                    </div>
                  </td>
                </tr>
              ) : (data?.data?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={isRestaurant ? 6 : 9}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                data?.data?.map((booking) => (
                  <tr
                    key={booking._id}
                    className="bg-theme-card hover:bg-theme-hover transition-colors duration-150 group"
                  >
                    {/* Guest Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={booking?.usersRef?.profilePic?.small ?? DefaultProfilePic}
                          width={40}
                          height={40}
                          alt=""
                          className="h-10 w-10 rounded-full flex-shrink-0 object-cover ring-2 ring-theme-primary"
                        />
                        <div className="min-w-0">
                          <p className="text-body-sm text-theme-tertiary truncate">
                            #{booking?.bookingID}
                          </p>
                          <p className="text-body-md font-medium text-theme-primary truncate">
                            {booking?.usersRef?.name ?? "Guest"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4">
                      <p className="text-body-sm text-theme-primary">
                        {(booking?.usersRef?.dialCode ?? "") +
                          " " +
                          (booking?.usersRef?.phoneNumber ?? "")}
                      </p>
                    </td>

                    {/* Date Order */}
                    <td className="px-4 py-4">
                      <p className="text-body-sm text-theme-primary">
                        {booking?.createdAt
                          ? moment(booking.createdAt).format("MMM DD, YYYY")
                          : "-"}
                      </p>
                    </td>

                    {/* Check In / Table Booked */}
                    {isRestaurant ? (
                      <td className="px-4 py-4">
                        <p className="text-body-sm text-theme-primary">
                          {booking?.checkIn
                            ? moment.utc(booking.checkIn).format("MMM DD, YYYY")
                            : "-"}
                        </p>
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-4">
                          <p className="text-body-sm text-theme-primary">
                            {booking?.checkIn
                              ? moment.utc(booking.checkIn).format("MMM DD, YYYY")
                              : "-"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-body-sm text-theme-primary">
                            {booking?.checkOut
                              ? moment.utc(booking.checkOut).format("MMM DD, YYYY")
                              : "-"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-body-sm text-theme-primary capitalize">
                            {booking?.roomsRef?.roomType ?? "-"}
                          </p>
                        </td>
                      </>
                    )}

                    {/* Created */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-body-sm font-medium text-theme-primary">
                          {moment(booking.createdAt).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-body-sm text-theme-tertiary">
                          {moment(booking.createdAt).fromNow()}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        {["created", "pending"].includes(booking.status) ? (
                          <>
                            <StatusButton
                              status={booking.status}
                              isToggled={toggleIndex === booking._id}
                              onClick={() =>
                                toggleIndex === booking._id
                                  ? setToggleIndex("")
                                  : setToggleIndex(booking._id)
                              }
                            />
                            <StatusDropDown
                              open={booking._id === toggleIndex}
                              onStatusChange={(status) =>
                                handleStatusChange(status, booking._id)
                              }
                            />
                          </>
                        ) : (
                          <StatusButton status={booking.status} disabled={true} />
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    {!isRestaurant && (
                      <td className="px-4 py-4">
                        <Button.Hotel.View
                          name="View"
                          svg={<SVG.Eye />}
                          onClick={() =>
                            router.push(`/hotels/booking-management/${booking?._id}`)
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Paginator
          pageNo={pageNo}
          totalPages={totalPages}
          totalResources={totalResources}
          onPageChange={(e, newPageNo) => setPageNo(newPageNo)}
        />
      </div>
    </div>
  );
};

export default BookingTable;
