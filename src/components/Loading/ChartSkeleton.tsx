import React from "react";

const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 350 }) => {
  return (
    <div className="w-full animate-pulse" style={{ height: `${height}px` }}>
      {/* Chart header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
      </div>

      {/* Chart area skeleton */}
      <div className="relative h-full w-full rounded-lg border border-stroke dark:border-strokedark bg-gray-50 dark:bg-boxdark-2">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4 pl-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-8 rounded bg-gray-200 dark:bg-boxdark-hover"
            ></div>
          ))}
        </div>

        {/* Chart grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pl-12 pr-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-px w-full bg-gray-200 dark:bg-boxdark-hover"
            ></div>
          ))}
        </div>

        {/* Chart line skeleton */}
        <div className="absolute bottom-0 left-12 right-4 top-0 flex items-end justify-between pb-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-6 rounded-t bg-primary/30 dark:bg-primary/20"
              style={{
                height: `${Math.random() * 60 + 20}%`,
              }}
            ></div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-4 flex justify-between px-2 pb-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-10 rounded bg-gray-200 dark:bg-boxdark-hover"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
