"use client";

import { useEffect, useState, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "light" | "dark";

function isAdminThemeHost(hostname: string) {
  // Restrict theme switching to admin subdomain in production.
  // Allow localhost in non-prod to make local development usable.
  if (hostname === "admin.thehotelmedia.com") return true;
  if (process.env.NODE_ENV !== "production" && hostname === "localhost") return true;
  return false;
}

function getEnforcedTheme(): Theme | null {
  if (typeof window === "undefined") return "dark";

  const pathname = window.location.pathname ?? "";
  const hostname = window.location.hostname ?? "";

  // Hotel login should always be light (existing behavior).
  const isHotelsLogin = pathname.includes("/hotels/login");
  if (isHotelsLogin) return "light";

  // Keep hotels area dark, even if somehow rendered on admin host.
  const isHotelsArea = pathname.startsWith("/hotels");
  if (isHotelsArea) return "dark";

  // On non-admin hosts, force dark mode.
  if (!isAdminThemeHost(hostname)) return "dark";

  // On admin host we allow user preference (no enforcement).
  return null;
}

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

    const enforced = getEnforcedTheme();
    if (enforced) {
      setColorModeStorage(enforced);
    } else {
      // Admin host: respect stored preference; ensure it's valid.
      const stored = localStorage.getItem("thm-theme");
      if (stored === "light" || stored === "dark") {
        setColorModeStorage(stored);
      } else {
        setColorModeStorage("dark");
      }
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
    const enforced = getEnforcedTheme();

    document.documentElement.classList.add("theme-transitioning");

    // If theme is enforced (non-admin hosts / hotels area), ignore requested theme.
    setColorModeStorage(enforced ?? theme);

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);
  }, [setColorModeStorage]);

  return [colorMode, setColorMode];
};

export default useColorMode;
