"use client";
import React, { useState, ReactNode, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

type MainLayoutProps = AdminLayoutSearchableProps | MainLayoutNonSearchableProps;


export default function AdminLayout(props: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <InputProvider>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col lg:ml-72.5">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isSearchable={props.isSearchable} queryPlaceholder={props.searchPlaceholder ?? ""} />
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
