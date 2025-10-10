import type { Metadata } from "next";
import localFont from "next/font/local";
import TanstackQueryProvider from "@/context/TanstackQueryProvider";
import { getServerSession } from "next-auth/next";
import Provider from "@/context/ClientProvider";
import { Toaster } from 'react-hot-toast';
import authOptions from "@/utils/authOptions";
import dynamic from 'next/dynamic'
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
    template: "%s | The Hotel Media"
  },
  description: "Discover and share the best hotels, restaurants, bars, and nightclubs with The Hotel Media, the ultimate social platform for travelers and nightlife enthusiasts. Whether you're looking for a luxurious hotel, a cozy café, a lively bar, or the hottest nightclub in town, our app helps you connect with like-minded people and explore top-rated venues worldwide.",
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getServerSession(authOptions);
  const CrispWithNoSSR = dynamic(() => import('@/components/CrispChat'));
  return (
    <html lang="en">
      <CrispWithNoSSR />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`} suppressHydrationWarning={true}>
        <Provider session={session}>
          <Toaster toastOptions={{
            position: 'top-right'
          }} />
          <TanstackQueryProvider>
            {children}
          </TanstackQueryProvider>
        </Provider>
      </body>
    </html>
  );
}
