"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Lock background scroll when the mobile/tablet drawer is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isXlUp = window.matchMedia("(min-width: 1280px)").matches;
    if (isXlUp) return;
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary overflow-x-hidden">
      <InputProvider>
        {/* Page Wrapper */}
        <div className="flex min-w-0">
          {/* Sidebar */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Backdrop for off-canvas sidebar (mobile/tablet) */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`
              fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm
              transition-opacity duration-300 ease-out
              xl:hidden
              ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}
            `}
            aria-hidden="true"
          />

          {/* Content Area */}
          <div className="relative flex min-w-0 flex-1 flex-col xl:ml-64">
            {/* Header */}
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isSearchable={props.isSearchable}
              queryPlaceholder={props.searchPlaceholder ?? ""}
            />

            {/* Main Content */}
            <main className="flex-1">
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 lg:p-8">
                {props.children}
              </div>
            </main>
          </div>
        </div>
      </InputProvider>
    </div>
  );
}

/**
 * Page Title Component
 */
export const PageTitle: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  subtitle?: string;
}> = ({ children, className, subtitle }) => {
  return (
    <div className={className}>
      <h1 className="text-heading-2 font-semibold text-theme-primary">
        {children}
      </h1>
      {subtitle && (
        <p className="mt-1 text-body-md text-theme-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Page Content Container
 */
export const PageContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={`
      rounded-xl border border-theme-primary
      bg-theme-card shadow-theme-card
      p-4 md:p-6
      ${className || ''}
    `}>
      {children}
    </div>
  );
};

/**
 * Card Component for dashboard sections
 */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className, hover = false }) => {
  return (
    <div className={`
      rounded-lg border border-theme-primary
      bg-theme-card shadow-theme-card
      p-4 md:p-5
      transition-all duration-200
      ${hover ? "card-hover cursor-pointer" : ""}
      ${className || ''}
    `}>
      {children}
    </div>
  );
};

/**
 * Section Header Component
 */
export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className || ''}`}>
      <div>
        <h2 className="text-heading-4 font-semibold text-theme-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-body-sm text-theme-secondary">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
