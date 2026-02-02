"use client";
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BookingTable from "@/components/Hotel/Common/Booking/Table";
export default function BookingManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const [timelineFilter, setTimelineFilter] = useState("1w");
  const [checkEvent, setCheckEvent] = useState("Today Check In");
  const businessTypeName = session?.user?.businessTypeName;
  console.log(session?.user);
  console.log(businessTypeName);

  const isHotel = businessTypeName === "Hotel" || businessTypeName === "Home Stays";
  const isRestaurant = businessTypeName === "Restaurant";
  const pageTitle = isRestaurant ? "Table Management" : "Booking Management";

  useEffect(() => {
    if (session && isRestaurant) {
      router.replace("/hotels/table-management");
    }
  }, [session, isRestaurant, router]);

  const handleTimelineFilterClick = (text: string) => {
    setTimelineFilter(text);
  };
  const handelCheckEventClick = (text: string) => {
    setCheckEvent(text);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
        <PageTitle>{pageTitle}</PageTitle>
        <div className="w-full max-w-full overflow-x-auto no-scrollbar">
          <div className="flex w-max gap-2 justify-end items-center ml-auto">
          {isHotel && (
            <div
              className="inline-flex rounded-lg shadow-xs dark:bg-primary/60 bg-primary/60 p-0.5"
              role="group"
            >
              {["Today Check In", "Today Check Out"].map((text, index) => {
                return (
                  <button
                    onClick={() => handelCheckEventClick(text)}
                    type="button"
                    key={index}
                    className={`${
                      checkEvent === text
                        ? "bg-[#4881F5] dark:bg-[#4881F5] border-[#4881F5]"
                        : "text-white/50  dark:text-white/50 border-transparent"
                    } px-2.5 py-1.5 text-sm font-normal text-gray-900 border  rounded-lg hover:bg-primary/50 dark:text-white  dark:hover:bg-[#4881F5]/80 dark:hover:text-white hover:text-white`}
                  >
                    <span className="px-1.5">{text}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div
            className="inline-flex rounded-lg shadow-xs dark:bg-primary/60 bg-primary/60 p-0.5"
            role="group"
          >
            {["1h", "1d", "1w", "1m", "1y"].map((text, index) => {
              return (
                <button
                  onClick={() => handleTimelineFilterClick(text)}
                  type="button"
                  key={index}
                  className={`${
                    timelineFilter === text
                      ? "bg-[#4881F5] dark:bg-[#4881F5] border-[#4881F5]"
                      : "text-white/50  dark:text-white/50 border-transparent"
                  } px-2.5 py-1.5 text-sm font-normal text-gray-900 border  rounded-lg hover:bg-primary/50 dark:text-white  dark:hover:bg-[#4881F5]/80 dark:hover:text-white hover:text-white`}
                >
                  <span className="px-1.5">{text}</span>
                </button>
              );
            })}
          </div>
          <div
            className="inline-flex rounded-lg shadow-xs dark:bg-primary/60 bg-primary/60 p-0.5"
            role="group"
          >
            <button
              onClick={() => {}}
              type="button"
              className={`${
                true ? " " : "text-white/50"
              } px-2.5 py-1.5 text-sm font-normal text-gray-900 border-0  rounded-lg hover:bg-primary/50 dark:text-white  dark:hover:bg-[#4881F5]/80 dark:hover:text-white hover:text-white`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.82227 2.06055V4.4429"
                  stroke="white"
                  strokeWidth="1.54853"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.1758 2.06055V4.4429"
                  stroke="white"
                  strokeWidth="1.54853"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.24902 7.68945H16.749"
                  stroke="white"
                  strokeWidth="1.54853"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.1467 7.22059V13.9706C17.1467 16.3529 15.9555 17.9412 13.1761 17.9412H6.82313C4.04372 17.9412 2.85254 16.3529 2.85254 13.9706V7.22059C2.85254 4.83824 4.04372 3.25 6.82313 3.25H13.1761C15.9555 3.25 17.1467 4.83824 17.1467 7.22059Z"
                  stroke="white"
                  strokeWidth="1.54853"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.9337 11.3502H12.9408"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.9337 13.733H12.9408"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.99524 11.3502H10.0024"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.99524 13.733H10.0024"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.05676 11.3502H7.06389"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.05676 13.733H7.06389"
                  stroke="white"
                  strokeWidth="1.54853"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          </div>
          {/* <Button.Hotel.Button name="Export" onClick={() => {
                        setModal(!modal);
                        setFormInputs(initialFormInputs);
                        setEditMode(false);
                    }} svg={<SVG.Museum />}></Button.Hotel.Button> */}
        </div>
      </div>
      <PageContent>
        <BookingTable />
      </PageContent>
    </>
  );
}
