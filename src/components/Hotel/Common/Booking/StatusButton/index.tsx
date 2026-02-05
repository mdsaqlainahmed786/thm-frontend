"use client";

import React from "react";

interface StatusButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  status: string;
  isToggled?: boolean;
  text?: string;
  disabled?: boolean;
}

/**
 * Status color mapping based on booking status
 */
const getStatusStyles = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
    case "created":
      return {
        bg: "bg-status-warning",
        bgHover: "hover:bg-status-warning/90",
        ring: "focus:ring-status-warning/30",
        icon: "text-white",
      };
    case "confirmed":
      return {
        bg: "bg-status-success",
        bgHover: "hover:bg-status-success/90",
        ring: "focus:ring-status-success/30",
        icon: "text-white",
      };
    case "checked in":
      return {
        bg: "bg-brand-primary",
        bgHover: "hover:bg-brand-primary/90",
        ring: "focus:ring-brand-primary/30",
        icon: "text-white",
      };
    case "completed":
      return {
        bg: "bg-status-info",
        bgHover: "hover:bg-status-info/90",
        ring: "focus:ring-status-info/30",
        icon: "text-white",
      };
    case "canceled":
    case "canceled by business":
    case "canceled by user":
      return {
        bg: "bg-status-error",
        bgHover: "hover:bg-status-error/90",
        ring: "focus:ring-status-error/30",
        icon: "text-white",
      };
    case "no show":
      return {
        bg: "bg-theme-tertiary",
        bgHover: "hover:bg-theme-tertiary/90",
        ring: "focus:ring-theme-tertiary/30",
        icon: "text-white",
      };
    default:
      return {
        bg: "bg-theme-secondary",
        bgHover: "hover:bg-theme-secondary/90",
        ring: "focus:ring-theme-secondary/30",
        icon: "text-theme-primary",
      };
  }
};

/**
 * Format status text for display
 */
const formatStatusText = (status: string): string => {
  return status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const StatusButton: React.FC<StatusButtonProps> = ({
  onClick,
  status,
  isToggled,
  text,
  disabled = false,
}) => {
  const styles = getStatusStyles(status);
  const displayText = text ?? formatStatusText(status);
  const hasDropdown = isToggled !== undefined;

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-1.5
        rounded-full px-3 py-1.5
        text-label-sm font-semibold text-white
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${styles.bg}
        ${!disabled ? styles.bgHover : ""}
        ${styles.ring}
        ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
        ${hasDropdown ? "pr-7" : ""}
        min-h-[28px] min-w-[80px]
      `}
      aria-expanded={hasDropdown ? isToggled : undefined}
      aria-haspopup={hasDropdown ? "listbox" : undefined}
    >
      <span className="truncate">{displayText}</span>

      {/* Dropdown Arrow */}
      {hasDropdown && (
        <svg
          className={`
            absolute right-2.5 top-1/2 -translate-y-1/2
            h-3 w-3 transition-transform duration-200
            ${isToggled ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </button>
  );
};

export default StatusButton;

/**
 * StatusBadge - A non-interactive badge version for display only
 */
export const StatusBadge: React.FC<{
  status: string;
  size?: "sm" | "md" | "lg";
}> = ({ status, size = "md" }) => {
  const styles = getStatusStyles(status);
  const displayText = formatStatusText(status);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-label-sm",
    md: "px-3 py-1 text-body-sm",
    lg: "px-4 py-1.5 text-body-md",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium text-white
        ${styles.bg}
        ${sizeClasses[size]}
      `}
    >
      {displayText}
    </span>
  );
};

/**
 * AvailabilityBadge - For room/table availability status
 */
export const AvailabilityBadge: React.FC<{
  status: "available" | "occupied" | "unavailable" | "maintenance";
  size?: "sm" | "md" | "lg";
}> = ({ status, size = "md" }) => {
  const statusConfig = {
    available: {
      bg: "bg-status-success",
      text: "Available",
    },
    occupied: {
      bg: "bg-status-warning",
      text: "Occupied",
    },
    unavailable: {
      bg: "bg-status-error",
      text: "Unavailable",
    },
    maintenance: {
      bg: "bg-theme-tertiary",
      text: "Maintenance",
    },
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-label-sm",
    md: "px-3 py-1 text-body-sm",
    lg: "px-4 py-1.5 text-body-md",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium text-white
        ${config.bg}
        ${sizeClasses[size]}
      `}
    >
      {/* Status dot */}
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
      {config.text}
    </span>
  );
};
