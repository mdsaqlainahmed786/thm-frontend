import React, { ReactNode } from "react";

interface CardDataStatsProps {
  loading: boolean;
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  loading,
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-stroke/50 bg-white px-7.5 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-boxdark dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] dark:hover:bg-boxdark-hover dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)] ${
        loading ? "animate-pulse" : ""
      }`}
    >
      {/* Subtle glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5 dark:to-transparent" />

      {/* Icon container with larger size and gradient background */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_2px_4px_rgba(99,102,241,0.1)] dark:from-primary/20 dark:to-primary/10 dark:shadow-[0_2px_4px_rgba(99,102,241,0.2)]">
        <div className="scale-110">{children}</div>
      </div>

      <div className="relative mt-5 flex items-end justify-between">
        <div className="flex-1">
          {loading ? (
            <div className="mb-2 h-7 w-32 rounded-md bg-gray-200 dark:bg-boxdark-hover/50"></div>
          ) : (
            <h4 className="mb-1 text-title-md font-bold text-black dark:text-white">
              {total}
            </h4>
          )}
          <span className="text-sm font-medium text-body dark:text-bodydark">
            {title}
          </span>
        </div>

        {/* Trend tag with better spacing and styling */}
        {rate && rate.trim() !== "" && (
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              levelUp
                ? "bg-meta-3/10 text-meta-3 dark:bg-meta-3/20 dark:text-meta-3"
                : levelDown
                ? "bg-meta-1/10 text-meta-1 dark:bg-meta-1/20 dark:text-meta-1"
                : "bg-gray-200/50 text-body dark:bg-boxdark-hover/30 dark:text-bodydark"
            }`}
          >
            <span>{rate}</span>
            {levelUp && (
              <svg
                className="h-3.5 w-3.5 fill-meta-3"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            )}
            {levelDown && (
              <svg
                className="h-3.5 w-3.5 fill-meta-1"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                  fill=""
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDataStats;
