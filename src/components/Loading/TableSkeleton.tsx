import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
  showHeader = true,
}) => {
  return (
    <div className="w-full animate-pulse">
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
          <div className="h-8 w-40 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table header skeleton */}
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="px-4 py-4">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-boxdark-hover mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body skeleton */}
          <tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-stroke dark:border-strokedark"
              >
                {[...Array(columns)].map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-5">
                    {colIndex === 0 ? (
                      // First column - avatar and text
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-boxdark-hover"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
                          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
                        </div>
                      </div>
                    ) : colIndex === columns - 1 ? (
                      // Last column - action buttons
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
                        <div className="h-8 w-8 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
                      </div>
                    ) : (
                      // Other columns - simple text
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-boxdark-hover"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
