"use client";
import React, { useState, ReactNode, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect } from "react";
import { InputProvider } from "@/context/SearchProvider";
interface HotelAdminLayoutSearchableProps {
  isSearchable: true;
  searchPlaceholder: string;
  children: React.ReactNode;
}

interface MainLayoutNonSearchableProps {
  isSearchable: false;
  children: React.ReactNode;
  searchPlaceholder?: string;
}

type MainLayoutProps = HotelAdminLayoutSearchableProps | MainLayoutNonSearchableProps;


export default function HotelAdminLayout(props: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return (
    <div className=" dark:text-white text-white overflow-x-hidden">
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

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h3 className="text-xl font-medium text-white dark:text-white font-quicksand">
      {children}
    </h3>
  )
}
export const PageContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="rounded-xl border border-theme-gray bg-theme-black p-4 shadow-default dark:border-theme-gray dark:bg-theme-black">
      {children}
    </div>
  )
}