"use client";
import React from "react";
import { fetchBookings } from "@/api-services/booking";
import { keepPreviousData } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { DefaultProfilePic } from "@/components/Profile";
import moment from "moment";
import Paginator from "@/components/Paginator";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import SVG from "@/components/SVG";
import { useRouter } from "next/navigation";
import StatusButton from "../StatusButton";
import { changeBookingStatus } from "@/api-services/booking";
import StatusDropDown from "../StatusButton/dropdown";
import { useSession } from "next-auth/react";
const BookingTable: React.FC<{}> = () => {
  const { data: session } = useSession();
  const isRestaurant = session?.user?.businessTypeName === "Restaurant";
  const router = useRouter();
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [toggleIndex, setToggleIndex] = useState("");
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["bookings", pageNo],
    queryFn: () => fetchBookings({ pageNumber: pageNo }),
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
      console.log(status, bookingID);
      setToggleIndex("");
      await changeBookingStatus(bookingID, status);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="border dark:border-theme-gray border-theme-gray rounded-xl">
        <table className="w-full table-auto font-quicksand">
          <thead>
            <tr className="bg-primary/50 text-left dark:bg-primary/50 text-sm">
              <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white xl:pl-11 min-w-[220px] ">
                Guest Name
              </th>
              <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                Phone Number
              </th>
              <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                Date Order
              </th>
              {isRestaurant ? (
                <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                  Table Booked
                </th>
              ) : (
                <>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                    Check In
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                    Check Out
                  </th>
                </>
              )}
              {!isRestaurant && (
                <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                  Room Type
                </th>
              )}
              <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white min-w-[120px] ">
                Created
              </th>
              <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white">
                Status
              </th>
              {!isRestaurant && (
                <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={isRestaurant ? 7 : 9}>
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
                {data &&
                  data.data &&
                  data.data.map((booking) => {
                    return (
                      <tr
                        key={booking._id}
                        className="even:bg-primary/10 odd:bg-theme-black dark:even:bg-primary/10 dark:odd:bg-theme-black hover:bg-primary/30 dark:hover:bg-primary/30 group [&:not(:last-child)]:border-b  dark:[&:not(:last-child)]:border-theme-gray [&:not(:last-child)]:border-theme-gray"
                      >
                        <td className="px-4 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                          <div className="flex gap-3 items-center">
                            <Image
                              src={
                                booking &&
                                booking.usersRef &&
                                booking.usersRef.profilePic &&
                                booking.usersRef.profilePic.small
                                  ? booking.usersRef.profilePic.small
                                  : DefaultProfilePic
                              }
                              width={50}
                              height={50}
                              alt=""
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="text-white/60 dark:text-white/60">
                                #{booking && booking.bookingID}
                              </p>
                              <h5 className="font-medium text-base text-white dark:text-white">
                                {booking &&
                                  booking.usersRef &&
                                  booking.usersRef.name}
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                          <p className="text-white dark:text-white text-sm">
                            {booking &&
                              booking.usersRef &&
                              booking.usersRef.dialCode +
                                " " +
                                booking.usersRef.phoneNumber}
                          </p>
                        </td>
                        <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                          <p className="text-white dark:text-white text-sm">
                            {booking && booking.createdAt
                              ? moment(booking.createdAt).format("MM-DD-YYYY")
                              : null}
                          </p>
                        </td>
                        {isRestaurant ? (
                          <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                            <p className="text-white dark:text-white text-sm">
                              {booking && booking.checkIn
                                ? moment
                                    .utc(booking.checkIn)
                                    .format("MM-DD-YYYY")
                                : null}
                            </p>
                          </td>
                        ) : (
                          <>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm">
                                {booking && booking.checkIn
                                  ? moment
                                      .utc(booking.checkIn)
                                      .format("MM-DD-YYYY")
                                  : null}
                              </p>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm">
                                {booking && booking.checkOut
                                  ? moment
                                      .utc(booking.checkOut)
                                      .format("MM-DD-YYYY")
                                  : null}
                              </p>
                            </td>
                          </>
                        )}

                        {!isRestaurant && (
                          <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                            <p className="text-white dark:text-white text-sm capitalize">
                              {booking &&
                                booking.roomsRef &&
                                booking.roomsRef.roomType}
                            </p>
                          </td>
                        )}
                        <td className=" px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                          <p className="text-white dark:text-white text-xs font-semibold">
                            {moment(booking.createdAt).format(
                              "ddd DD, MMM YYYY hh:mm:ss A"
                            )}
                          </p>
                          <p className="text-white dark:text-white text-xs font-medium">
                            {moment(booking.createdAt).fromNow()}
                          </p>
                        </td>
                        <td className=" px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                          <div className="w-40 relative">
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
                              <StatusButton
                                status={booking.status}
                                disabled={true}
                              />
                            )}
                          </div>
                        </td>
                        {!isRestaurant && (
                          <td className=" px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                            <div className="flex gap-2 justify-end pe-2">
                              <Button.Hotel.View
                                name="View"
                                svg={<SVG.Eye />}
                                onClick={() =>
                                  router.push(
                                    `/hotels/booking-management/${booking?._id}`
                                  )
                                }
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Paginator
        pageNo={pageNo}
        totalPages={totalPages}
        totalResources={totalResources}
        onPageChange={(e, pageNo) => setPageNo(pageNo)}
      />
    </div>
  );
};

export default BookingTable;
