import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDropdownProps {
  item: Array<{ label: string; route: string }>;
}

const SidebarDropdown = ({ item }: SidebarDropdownProps) => {
  const pathname = usePathname();

  return (
    <ul className="mt-1 flex flex-col gap-0.5 pl-10 pr-3">
      {item.map((child, index) => {
        const isActive = pathname === child.route;
        
        return (
          <li key={index}>
            <Link
              href={child.route}
              className={`
                group relative flex items-center gap-2 rounded-md px-3 py-2
                text-body-sm font-medium
                transition-colors duration-200
                min-h-9
                ${isActive 
                  ? "text-brand-primary bg-brand-primary-light dark:bg-brand-primary/10" 
                  : "text-theme-secondary hover:text-theme-primary hover:bg-theme-hover"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Dot indicator */}
              <span 
                className={`
                  h-1.5 w-1.5 rounded-full flex-shrink-0
                  transition-colors duration-200
                  ${isActive 
                    ? "bg-brand-primary" 
                    : "bg-theme-tertiary group-hover:bg-brand-primary"
                  }
                `}
              />
              
              <span className="truncate">{child.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarDropdown;
