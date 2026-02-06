import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarDropdown from "./SidebarDropdown";

interface SidebarItemProps {
  item: {
    icon: React.ReactNode;
    label: string;
    route: string;
    children?: Array<{ label: string; route: string }>;
  };
  pageName: string;
  setPageName: (name: string) => void;
  onNavigate?: () => void;
}

const SidebarItem = ({ item, pageName, setPageName, onNavigate }: SidebarItemProps) => {
  const normalizedLabel = item.label.toLowerCase();
  const hasChildren = !!item.children?.length;

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

  const pathname = usePathname();

  const isActive = (menuItem: typeof item): boolean => {
    if (menuItem.route === pathname) return true;
    if (menuItem.children) {
      return menuItem.children.some((child) => child.route === pathname);
    }
    return false;
  };

  const isItemActive = isActive(item);
  const isExpanded = pageName === normalizedLabel;

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`
          group relative flex items-center gap-3 rounded-lg px-3 py-2.5
          text-body-md font-medium
          transition-all duration-200 ease-out
          min-h-11
          ${isItemActive 
            ? "bg-brand-primary text-white shadow-theme-sm" 
            : "text-theme-secondary hover:bg-theme-hover hover:text-theme-primary"
          }
          ${isItemActive ? "border-l-3 border-white/30" : ""}
        `}
        aria-current={isItemActive ? "page" : undefined}
      >
        {/* Icon */}
        <span className={`
          flex-shrink-0 transition-colors duration-200
          ${isItemActive 
            ? "text-white" 
            : "text-theme-tertiary group-hover:text-brand-primary"
          }
        `}>
          {item.icon}
        </span>
        
        {/* Label */}
        <span className="flex-1 truncate">{item.label}</span>
        
        {/* Dropdown Arrow */}
        {item.children && (
          <svg
            className={`
              h-4 w-4 flex-shrink-0 transition-transform duration-200
              ${isExpanded ? "rotate-180" : ""}
              ${isItemActive ? "text-white/70" : "text-theme-tertiary"}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </Link>

      {/* Dropdown Children */}
      {item.children && (
        <div
          className={`
            overflow-hidden transition-all duration-200 ease-out
            ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <SidebarDropdown item={item.children} onNavigate={onNavigate} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
