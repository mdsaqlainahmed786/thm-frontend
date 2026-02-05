import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import TanstackQueryProvider from "@/context/TanstackQueryProvider";
import { getServerSession } from "next-auth/next";
import Provider from "@/context/ClientProvider";
import { Toaster } from "react-hot-toast";
import authOptions from "@/utils/authOptions";
import dynamic from "next/dynamic";
import "../css/globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "%s | The Hotel Media",
  },
  description:
    "Discover and share the best hotels, restaurants, bars, and nightclubs with The Hotel Media, the ultimate social platform for travelers and nightlife enthusiasts. Whether you're looking for a luxurious hotel, a cozy café, a lively bar, or the hottest nightclub in town, our app helps you connect with like-minded people and explore top-rated venues worldwide.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

// Ensure the site scales correctly on mobile/iPad (Next.js recommends exporting `viewport`)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Script to set initial theme before React hydrates
 * This prevents flash of wrong theme
 */
const ThemeScript = () => {
  const script = `
    (function() {
      try {
        // Check if we're on login page
        var isLoginPage = window.location.pathname.includes('/hotels/login');
        var theme = 'dark'; // Default to dark mode
        
        if (isLoginPage) {
          // Force light mode for login page only
          theme = 'light';
        } else {
          // For all other pages, always use dark mode (ignore any stored preference)
          theme = 'dark';
          // Clear any light mode preference from localStorage
          if (localStorage.getItem('thm-theme') === 'light') {
            localStorage.setItem('thm-theme', 'dark');
          }
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.add(theme);
        if (theme === 'dark') {
          document.body.classList.remove('light');
        } else {
          document.body.classList.remove('dark');
        }
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const CrispWithNoSSR = dynamic(() => import("@/components/CrispChat"));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <CrispWithNoSSR />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          font-sans antialiased
          bg-theme-primary text-theme-primary
          transition-colors duration-300
        `}
        suppressHydrationWarning
      >
        <Provider session={session}>
          <Toaster
            toastOptions={{
              position: "top-right",
              style: {
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-primary)",
              },
              success: {
                iconTheme: {
                  primary: "var(--status-success)",
                  secondary: "white",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--status-error)",
                  secondary: "white",
                },
              },
            }}
          />
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </Provider>
      </body>
    </html>
  );
}
