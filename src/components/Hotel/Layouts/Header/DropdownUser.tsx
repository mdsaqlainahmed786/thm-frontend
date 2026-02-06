"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { signOut, useSession } from "next-auth/react";
import { DefaultProfilePic } from "@/components/Profile";
import { HOTEL_LOGIN_URL } from "@/types/auth";

const DropdownUser = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const avatarSrc =
    (session?.user as any)?.businessProfilePic?.small ??
    session?.user?.profilePic?.small ??
    DefaultProfilePic;

  const businessName = session?.user?.businessName ?? "Business Name";
  const userName = session?.user?.name ?? "User";

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="
          flex items-center gap-2 sm:gap-3 rounded-lg
          p-1.5 sm:p-2
          transition-colors duration-200
          hover:bg-theme-hover
        "
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-brand-primary/20">
          <Image
            width={36}
            height={36}
            src={avatarSrc}
            alt={businessName}
            className="h-full w-full object-cover"
          />
        </span>

        {/* User Info (Desktop) */}
        <span className="hidden text-left lg:block">
          <span className="block text-body-sm font-semibold text-theme-primary truncate max-w-32">
            {businessName}
          </span>
          <span className="block text-body-sm text-theme-secondary capitalize truncate max-w-32">
            {userName}
          </span>
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`
            hidden sm:block h-4 w-4 text-theme-tertiary
            transition-transform duration-200
            ${dropdownOpen ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="
            absolute right-0 mt-2 w-56
            rounded-lg border border-theme-primary
            bg-theme-elevated shadow-theme-lg
            animate-scale-in origin-top-right
            overflow-hidden
          "
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="border-b border-theme-primary px-4 py-3">
            <p className="text-body-sm font-semibold text-theme-primary truncate">
              {businessName}
            </p>
            <p className="text-body-sm text-theme-secondary truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/hotels/profile"
              className="
                flex items-center gap-3 px-4 py-2.5
                text-body-md text-theme-secondary
                transition-colors duration-200
                hover:bg-theme-hover hover:text-theme-primary
              "
              role="menuitem"
              onClick={() => setDropdownOpen(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              My Profile
            </Link>

            <Link
              href="/hotels/support"
              className="
                flex items-center gap-3 px-4 py-2.5
                text-body-md text-theme-secondary
                transition-colors duration-200
                hover:bg-theme-hover hover:text-theme-primary
              "
              role="menuitem"
              onClick={() => setDropdownOpen(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help & Support
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-theme-primary py-1">
            <button
              className="
                flex w-full items-center gap-3 px-4 py-2.5
                text-body-md text-status-error
                transition-colors duration-200
                hover:bg-status-error/10
              "
              role="menuitem"
              onClick={async () => {
                await signOut({
                  redirect: false,
                  callbackUrl: HOTEL_LOGIN_URL,
                });
                window.location.href = HOTEL_LOGIN_URL;
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
