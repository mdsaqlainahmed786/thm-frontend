"use client";
import React, { useState, ReactNode, useCallback, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import TanstackQueryProvider from "@/context/TanstackQueryProvider";
import { InputProvider } from "@/context/SearchProvider";
interface AdminLayoutSearchableProps {
  isSearchable: true;
  searchPlaceholder: string;
  children: React.ReactNode;
}

interface MainLayoutNonSearchableProps {
  isSearchable: false;
  children: React.ReactNode;
  searchPlaceholder?: string;
}

type MainLayoutProps =
  | AdminLayoutSearchableProps
  | MainLayoutNonSearchableProps;

export default function AdminLayout(props: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const collapsed = localStorage.getItem("sidebarCollapsed");
        if (collapsed !== null) {
          setIsCollapsed(JSON.parse(collapsed));
        }
      } catch (error) {
        setIsCollapsed(false);
      }
    };

    const handleCustomEvent = (event: any) => {
      // Use the value from the event detail if available, otherwise read from localStorage
      if (event.detail && typeof event.detail.isCollapsed === "boolean") {
        setIsCollapsed(event.detail.isCollapsed);
      } else {
        handleStorageChange();
      }
    };

    // Check initial state
    if (typeof window !== "undefined") {
      try {
        const collapsed = localStorage.getItem("sidebarCollapsed");
        if (collapsed !== null) {
          setIsCollapsed(JSON.parse(collapsed));
        } else {
          setIsCollapsed(false);
        }
      } catch (error) {
        setIsCollapsed(false);
      }
    }

    // Listen for storage changes (from other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom events (for same-tab updates)
    window.addEventListener("sidebarCollapseChange", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sidebarCollapseChange", handleCustomEvent);
    };
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <InputProvider>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div
            className={`relative flex flex-1 flex-col transition-all duration-300 ${
              isCollapsed ? "lg:ml-20" : "lg:ml-72.5"
            }`}
          >
            {/* <!-- ===== Header Start ===== --> */}
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isSearchable={props.isSearchable}
              queryPlaceholder={props.searchPlaceholder ?? ""}
            />
            {/* <!-- ===== Header End ===== --> */}
            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {props.children}
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </InputProvider>
    </div>
  );
}
