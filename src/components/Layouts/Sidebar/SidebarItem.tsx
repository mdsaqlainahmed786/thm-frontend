import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarDropdown from "./SidebarDropdown";

type SidebarChildItem = { label: string; route: string };

type SidebarMenuItem = {
  icon: React.ReactNode;
  label: string;
  route: string;
  children?: SidebarChildItem[];
};

const SidebarItem = ({
  item,
  pageName,
  setPageName,
  onNavigate,
}: {
  item: SidebarMenuItem;
  pageName: string;
  setPageName: (next: string) => void;
  onNavigate?: () => void;
}) => {
  const normalizedLabel = item.label.toLowerCase();
  const hasChildren = !!item.children?.length;

  const pathname = usePathname();

  const isItemActive = useMemo(() => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child) => child.route === pathname);
    }
    return false;
  }, [item.children, item.route, pathname]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onNavigate?.();

      // Parent items act as expand/collapse toggles (avoid navigating to `#`).
      if (hasChildren) {
        e.preventDefault();
      }

      const updatedPageName = pageName !== normalizedLabel ? normalizedLabel : "";
      setPageName(updatedPageName);
    },
    [hasChildren, normalizedLabel, onNavigate, pageName, setPageName],
  );

  return (
    <>
      <li>
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${
            isItemActive ? "bg-graydark dark:bg-boxdark-hover" : ""
          } group relative flex items-center gap-3 rounded-sm px-4 py-2.5 font-medium text-bodydark1 transition-all duration-200 ease-in-out hover:bg-graydark dark:text-bodydark1 dark:hover:bg-boxdark-hover`}
        >
          {/* Active highlight strip on the left */}
          <span
            className={`absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-200 ${
              isItemActive ? "h-5 opacity-100" : "h-0 opacity-0"
            }`}
          ></span>
          <span className="relative z-10 flex items-center gap-3">
            <span
              className={`transition-colors duration-200 ${
                isItemActive
                  ? "text-primary dark:text-primary"
                  : "text-bodydark2 dark:text-bodydark"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`transition-colors duration-200 flex-1 truncate ${
                isItemActive
                  ? "text-white dark:text-white"
                  : "text-bodydark1 dark:text-bodydark"
              }`}
            >
              {item.label}
            </span>
            {item.children && (
              <svg
                className={`flex-shrink-0 fill-current text-bodydark2 transition-transform duration-300 ease-in-out dark:text-bodydark ${
                  pageName === normalizedLabel ? "rotate-180" : ""
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                  fill=""
                />
              </svg>
            )}
          </span>
        </Link>

        {item.children && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              pageName === normalizedLabel
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <SidebarDropdown item={item.children} onNavigate={onNavigate} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
