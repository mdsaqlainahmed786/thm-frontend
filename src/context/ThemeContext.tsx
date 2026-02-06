"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "thm-theme";
const TRANSITION_DURATION = 300;

/**
 * Get the initial theme - always dark mode (except login page)
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark"; // Default for SSR
  }

  // Check if we're on login page
  const isLoginPage = window.location.pathname.includes('/hotels/login');
  
  if (isLoginPage) {
    return "light"; // Force light mode for login page only
  }

  // For all other pages, always use dark mode (ignore localStorage)
  return "dark";
}

/**
 * Apply theme to the document
 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  // Set data-theme attribute on html element
  root.setAttribute("data-theme", theme);

  // Toggle dark class on body for backward compatibility
  if (theme === "dark") {
    body.classList.add("dark");
    body.classList.remove("light");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => defaultTheme || "dark");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = defaultTheme || getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, [defaultTheme]);

  // Disable system theme changes - always use dark mode (except login page)
  // Removed auto-switch functionality

  const setTheme = useCallback((newTheme: Theme) => {
    // Add transition class
    setIsTransitioning(true);
    document.documentElement.classList.add("theme-transitioning");

    // Update state and apply theme
    setThemeState(newTheme);
    applyTheme(newTheme);

    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, []);

  const toggleTheme = useCallback(() => {
    // Disable theme toggle - always use dark mode (except login page)
    // Check if we're on login page
    const isLoginPage = typeof window !== "undefined" && window.location.pathname.includes('/hotels/login');
    
    if (isLoginPage) {
      // Allow light mode only on login page
      setTheme("light");
    } else {
      // Force dark mode for all other pages
      setTheme("dark");
    }
  }, [setTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isTransitioning,
    }),
    [theme, setTheme, toggleTheme, isTransitioning]
  );

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook for backward compatibility with existing useColorMode usage
 */
export function useColorModeCompat(): [Theme, (theme: Theme) => void] {
  const { theme, setTheme } = useTheme();
  return [theme, setTheme];
}

export default ThemeContext;

