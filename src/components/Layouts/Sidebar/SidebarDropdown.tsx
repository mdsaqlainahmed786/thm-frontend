import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-2 flex flex-col gap-1 pl-8">
        {item.map((item: any, index: number) => {
          const isActive = pathname === item.route;
          return (
            <li key={index}>
              <Link
                href={item.route}
                className={`group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-boxdark-hover/50 text-white dark:text-white"
                    : "text-bodydark2 hover:text-white dark:text-bodydark dark:hover:text-white"
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"></span>
                )}
                <span className={isActive ? "ml-2" : ""}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SidebarDropdown;
