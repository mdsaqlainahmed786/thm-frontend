"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useSearchInput } from "@/context/SearchProvider";
import { usePathname } from "next/navigation";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isSearchable: boolean;
  queryPlaceholder: string;
}

/**
 * Generate breadcrumb items from pathname
 */
function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    // Capitalize and format the segment
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? "" : currentPath,
    });
  });

  return breadcrumbs;
}

const Header = (props: HeaderProps) => {
  const { value, setValue } = useSearchInput();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-999 flex h-16 w-full bg-theme-header border-b border-theme-primary shadow-theme-sm">
      <div className="flex flex-grow items-center justify-between gap-4 px-4 md:px-6">
        {/* Left Section: Hamburger + Logo (mobile) + Breadcrumbs (desktop) */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            aria-controls="sidebar"
            aria-label={props.isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={props.isSidebarOpen}
            onClick={(e) => {
              e.stopPropagation();
              props.setIsSidebarOpen((prev) => !prev);
            }}
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              border border-theme-primary bg-theme-secondary
              text-theme-secondary
              transition-all duration-200
              hover:bg-theme-hover hover:text-theme-primary
              active:scale-95
              xl:hidden
            "
          >
            <span className="sr-only">Toggle sidebar</span>
            <span className="relative block h-5 w-5">
              {/* Hamburger Icon / X Icon */}
              <span
                className={`
                  absolute left-0 block h-0.5 w-full rounded-sm bg-current
                  transition-all duration-300 ease-out
                  ${props.isSidebarOpen ? "top-2.5 rotate-45" : "top-1"}
                `}
              />
              <span
                className={`
                  absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-current
                  transition-all duration-200 ease-out
                  ${props.isSidebarOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
                `}
              />
              <span
                className={`
                  absolute left-0 block h-0.5 w-full rounded-sm bg-current
                  transition-all duration-300 ease-out
                  ${props.isSidebarOpen ? "top-2.5 -rotate-45" : "top-4"}
                `}
              />
            </span>
          </button>

          {/* Mobile Logo */}
          <Link className="flex-shrink-0 xl:hidden" href="/">
            <Image
              width={32}
              height={32}
              src="/images/logo/logo.svg"
              alt="The Hotel Media Logo"
            />
          </Link>

          {/* Breadcrumbs (Desktop only) */}
          <nav
            aria-label="Breadcrumb"
            className="hidden md:flex items-center gap-1.5"
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-theme-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-body-sm text-theme-secondary hover:text-brand-primary transition-colors duration-200"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-body-sm font-medium text-theme-primary">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Center Section: Search (Desktop) */}
        <div className="hidden flex-1 max-w-md lg:block">
          {props.isSearchable && (
            <div className="relative">
              <input
                type="text"
                value={value}
                placeholder={props.queryPlaceholder}
                onChange={(e) => setValue(e.target.value)}
                className="
                  w-full h-10 rounded-lg
                  bg-theme-secondary border border-theme-primary
                  pl-10 pr-4
                  text-body-md text-theme-primary placeholder:text-theme-tertiary
                  transition-all duration-200
                  focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                "
              />
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary">
                {value.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setValue("")}
                    className="hover:text-theme-primary transition-colors"
                    aria-label="Clear search"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ) : (
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          {props.isSearchable && (
            <button
              className="
                flex h-10 w-10 items-center justify-center rounded-lg
                text-theme-secondary hover:bg-theme-hover hover:text-theme-primary
                transition-colors duration-200
                lg:hidden
              "
              aria-label="Search"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}

          {/* Notification */}
          <DropdownNotification />

          {/* User Dropdown */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
