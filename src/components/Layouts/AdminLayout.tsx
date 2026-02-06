"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { InputProvider } from "@/context/SearchProvider";
import useLocalStorage from "@/hooks/useLocalStorage";

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
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    "adminSidebarOpen",
    false,
  );

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <InputProvider>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col transition-all duration-300 lg:ml-72.5">
            {/* <!-- ===== Header Start ===== --> */}
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
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
