"use client";

import React from "react";

interface CardDataStatsProps {
  loading?: boolean;
  title: string;
  count: number;
  children?: React.ReactNode;
  themeColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  loading = false,
  title,
  count,
  children,
  themeColor = "#3B82F6",
  trend,
}) => {
  // Format count based on title
  const formattedCount = React.useMemo(() => {
    if (typeof count !== "number") return "0";
    if (title.toLowerCase().includes("earning")) {
      return `₹${count.toLocaleString()}`;
    }
    return count.toLocaleString();
  }, [count, title]);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl
        border border-theme-primary bg-theme-card
        p-5 shadow-theme-card
        transition-all duration-300 ease-out
        hover:border-brand-primary/30 hover:shadow-theme-lg
        ${loading ? "animate-pulse" : ""}
      `}
    >
      {/* Hover gradient overlay */}
      <div
        className="
          absolute inset-0 opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
        style={{
          background: `linear-gradient(135deg, ${themeColor}10 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex items-start gap-4">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div
            className="
              flex h-14 w-14 items-center justify-center rounded-xl
              transition-transform duration-300 ease-out
              group-hover:scale-110 group-hover:-rotate-3
            "
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 8px 24px ${themeColor}40`,
            }}
          >
            <div className="text-white">{children}</div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-1 flex-col justify-center min-w-0">
          {/* Title */}
          <p className="text-label-sm font-medium text-theme-secondary uppercase tracking-wider mb-1.5">
            {title}
          </p>

          {/* Count */}
          {loading ? (
            <div className="h-8 w-24 rounded-md bg-theme-secondary animate-shimmer" />
          ) : (
            <div className="flex items-baseline gap-2">
              <h3 className="text-heading-2 font-bold text-theme-primary tracking-tight">
                {formattedCount}
              </h3>

              {/* Trend indicator */}
              {trend && (
                <span
                  className={`
                    inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5
                    text-label-sm font-semibold
                    ${
                      trend.isPositive
                        ? "bg-status-success/10 text-status-success"
                        : "bg-status-error/10 text-status-error"
                    }
                  `}
                >
                  <svg
                    className={`h-3 w-3 ${!trend.isPositive && "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  {trend.value}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div
        className="
          absolute bottom-0 left-0 h-1 w-0
          transition-all duration-300 ease-out
          group-hover:w-full
        "
        style={{ backgroundColor: themeColor }}
      />
    </div>
  );
};

export default CardDataStats;
