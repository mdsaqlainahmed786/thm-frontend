"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import { fetchBusinessNotifications } from "@/api-services/hotel";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import { DefaultProfilePic } from "@/components/Profile";
import moment from "moment";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchBusinessNotifications(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setNotifying(data?.hasUnreadNotifications ?? false);
  }, [data]);

  const notificationCount = data?.notifications?.length ?? 0;

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="
          relative flex h-10 w-10 items-center justify-center rounded-lg
          text-theme-secondary
          transition-colors duration-200
          hover:bg-theme-hover hover:text-theme-primary
        "
        aria-label={`Notifications${notifying ? " - You have unread notifications" : ""}`}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        {/* Notification Badge */}
        {notifying && (
          <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-error opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-error" />
          </span>
        )}

        {/* Bell Icon */}
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          className="
            absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)]
            rounded-lg border border-theme-primary
            bg-theme-elevated shadow-theme-lg
            animate-scale-in origin-top-right
            overflow-hidden
          "
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-theme-primary px-4 py-3">
            <h3 className="text-body-md font-semibold text-theme-primary">
              Notifications
            </h3>
            {notificationCount > 0 && (
              <span className="rounded-full bg-brand-primary px-2 py-0.5 text-label-sm text-white">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto thm-scrollbar">
            {data?.notifications && data.notifications.length > 0 ? (
              <ul>
                {data.notifications.map((notification: any, index: number) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="
                        flex gap-3 border-b border-theme-secondary px-4 py-3
                        transition-colors duration-200
                        hover:bg-theme-hover
                        last:border-b-0
                      "
                      onClick={() => setDropdownOpen(false)}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Image
                          src={notification.usersRef?.profilePic?.large ?? DefaultProfilePic}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm text-theme-primary line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-body-sm text-theme-tertiary">
                          {moment(notification?.createdAt).format("MMM DD, YYYY h:mm A")}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <span className="flex-shrink-0 mt-1.5">
                          <span className="block h-2 w-2 rounded-full bg-brand-primary" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-theme-secondary mb-3">
                  <svg
                    className="h-6 w-6 text-theme-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-body-sm text-theme-secondary text-center">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificationCount > 0 && (
            <div className="border-t border-theme-primary p-2">
              <Link
                href="#"
                className="
                  block w-full rounded-md px-3 py-2 text-center
                  text-body-sm font-medium text-brand-primary
                  transition-colors duration-200
                  hover:bg-brand-primary-light
                "
                onClick={() => setDropdownOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownNotification;
