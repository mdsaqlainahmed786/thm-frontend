"use client";

import React from "react";
import useColorMode from "@/hooks/useColorMode";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme Toggle Component
 * 
 * A pill-shaped toggle button for switching between light and dark themes.
 * Features:
 * - 52px × 28px rounded pill design
 * - Sun icon (light mode) / Moon icon (dark mode)
 * - Smooth 300ms transition
 * - Accessible with ARIA labels and keyboard navigation
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === "dark";

  const handleToggle = () => {
    // Disable theme toggle - always use dark mode (except login page)
    // Theme toggle is disabled per user request
    return;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={true}
      aria-label="Dark mode (theme toggle disabled)"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      disabled={true}
      className={`
        relative inline-flex h-7 w-[52px] shrink-0 cursor-not-allowed items-center 
        rounded-full border-2 border-transparent opacity-50
        transition-colors duration-300 ease-out
        bg-brand-primary
        ${className}
      `}
    >
      {/* Track background icons */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        {/* Sun icon (hidden) */}
        <span className="opacity-0">
          <SunIcon className="h-3.5 w-3.5 text-white" />
        </span>
        {/* Moon icon (always visible for dark mode) */}
        <span className="opacity-50">
          <MoonIcon className="h-3.5 w-3.5 text-white" />
        </span>
      </span>

      {/* Toggle thumb - always in dark mode position */}
      <span
        className="pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-out translate-x-[26px]"
      >
        {/* Moon icon always shown */}
        <MoonIcon className="h-3 w-3 text-brand-primary" />
      </span>
    </button>
  );
};

/**
 * Sun Icon Component
 */
const SunIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

/**
 * Moon Icon Component
 */
const MoonIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
);

export default ThemeToggle;

