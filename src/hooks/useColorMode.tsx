"use client";

import { useEffect, useState, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "light" | "dark";

/**
 * Hook to manage color mode (light/dark theme)
 * 
 * This hook provides backward compatibility with the existing codebase
 * while integrating with the new theme system.
 * 
 * @returns [colorMode, setColorMode] - Current theme and setter function
 */
const useColorMode = (): [Theme, (theme: Theme) => void] => {
  // Always default to dark mode
  const [colorMode, setColorModeStorage] = useLocalStorage<Theme>("thm-theme", "dark");
  const [mounted, setMounted] = useState(false);

  // Handle initial mount - always default to dark
  useEffect(() => {
    setMounted(true);

    // Check if we're on login page - if so, force light mode
    const isLoginPage = window.location.pathname.includes('/hotels/login');
    
    if (isLoginPage) {
      // Force light mode for login page only
      setColorModeStorage("light");
    } else {
      // For all other pages, always use dark mode (override any stored preference)
      setColorModeStorage("dark");
    }
  }, [setColorModeStorage]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;

    // Set data-theme attribute
    root.setAttribute("data-theme", colorMode);

    // Toggle dark class for backward compatibility
    if (colorMode === "dark") {
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      body.classList.remove("dark");
      body.classList.add("light");
    }
  }, [colorMode, mounted]);

  // Disable system theme changes - always use dark mode (except login page)
  // Removed auto-switch functionality

  const setColorMode = useCallback((theme: Theme) => {
    // Check if we're on login page
    const isLoginPage = window.location.pathname.includes('/hotels/login');
    
    if (isLoginPage) {
      // Allow light mode only on login page
      document.documentElement.classList.add("theme-transitioning");
      setColorModeStorage("light");
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 300);
    } else {
      // Force dark mode for all other pages
      document.documentElement.classList.add("theme-transitioning");
      setColorModeStorage("dark");
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 300);
    }
  }, [setColorModeStorage]);

  return [colorMode, setColorMode];
};

export default useColorMode;
