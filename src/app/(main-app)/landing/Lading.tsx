"use client";

import ContactUsForm from "@/components/Landing/ContactForm";
import Feature from "@/components/Landing/Feature";
import HeroSection from "@/components/Landing/Hero";
import Section3 from "@/components/Landing/Section3";
import Section4 from "@/components/Landing/Section4";
import Section5 from "@/components/Landing/Section5";
import Section6 from "@/components/Landing/Section6";
import Image from "next/image";
import Section7 from "@/components/Landing/Section7";
import THMMockup from "@/components/Landing/THMMockup";
import Footer from "@/components/Layouts/Public/Footer";
import Navbar from "@/components/Layouts/Public/Navbar";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DASHBOARD, HOTEL_DASHBOARD, HOTEL_LOGIN_ROUTE, LOGIN_ROUTE } from "@/types/auth";

export default function Landing() {
  const { scrollY } = useScroll();
  const [scrollVal, setScrollVal] = useState(0);

  const [windowWidth, setWindowWidth] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      if (status === "loading") return;

      const hostname = window.location.hostname;
      
      if (hostname.includes('hotels.thehotelmedia.com')) {
        if (session) {
          router.push(HOTEL_DASHBOARD);
        } else {
          router.push(HOTEL_LOGIN_ROUTE);
        }
      } else if (hostname.includes('admin.thehotelmedia.com')) {
        if (session) {
          router.push(DASHBOARD);
        } else {
          router.push(LOGIN_ROUTE);
        }
      }
    }
  }, [session, status, router]);

  // console.log("Landing; ", windowWidth)

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    // console.log("scrollY:", latestValue);  // Log the latest scrollY value
    setScrollVal(latestValue);
  });

  const section1Y = useSpring(
    useTransform(scrollY, [0, 400, 1500, 1501], [0, -280, -280, -1500]),
    { stiffness: 50, damping: 30 }
  );

  const section2Y = useSpring(useTransform(scrollY, [1501, 1550], [900, 0]), {
    stiffness: 50,
    damping: 30,
  });

  const section3Y = useSpring(useTransform(scrollY, [5030, 5100], [1200, 0]), {
    stiffness: 50,
    damping: 30,
  });

  const section4Y = useSpring(useTransform(scrollY, [6801, 6901], [1200, 0]), {
    stiffness: 50,
    damping: 30,
  });
  const section5Y = useSpring(useTransform(scrollY, [8600, 8700], [1200, 0]), {
    stiffness: 50,
    damping: 30,
  });

  const section6Y = useSpring(useTransform(scrollY, [9700, 9800], [-1200, 0]), {
    stiffness: 50,
    damping: 30,
  });

  const section8Y = useSpring(
    useTransform(scrollY, [10600, 10650, 11099, 11101], [1200, 200, 200, -200]),
    { stiffness: 50, damping: 30 }
  );
  const mobileSection8Y = useSpring(
    useTransform(scrollY, [10600, 10650, 10900], [1200, 0, -1000]),
    { stiffness: 80, damping: 40 }
  );

  const section9Y = useSpring(
    useTransform(scrollY, [11101, 11150], [1200, 250]),
    { stiffness: 50, damping: 30 }
  );
  const mobileSection9Y = useSpring(
    useTransform(scrollY, [10901, 11150], [1200, 0]),
    { stiffness: 50, damping: 30 }
  );

  // Step 1: Basic transform
  const rawHeroY = useTransform(scrollY, [100, 300], [0, -700]);
  const rawTHMY = useTransform(scrollY, [100, 300], [0, -300]);

  // Step 2: Smooth it with spring
  const heroY = useSpring(rawHeroY, {
    stiffness: 80,
    damping: 20,
  });
  const thmY = useSpring(rawTHMY, {
    stiffness: 80,
    damping: 20,
  });

  return (
    // <div className="container flex justify-center items-center">
    <div className="relative landing h-[1800vh] md:h-[1600vh]">
      {/* <Image src="/svg/hamburger.svg" alt="menu-bar" /> */}
      {/* Section 1 - Home */}

      <section id="home" className="relative min-h-screen ">
        <motion.div
          className="fixed  left-0 w-full flex items-center justify-center flex-col will-transform"
          style={{ y: section1Y }} // Apply transform on Y-axis
        >
          <motion.div style={{ y: heroY }}>
            <Navbar />
            <HeroSection />
          </motion.div>

          <motion.div
            style={{ y: windowWidth > 700 ? thmY : 0 }}
            className="will-transform"
          >
            <THMMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2 - Features */}
      <section id="features" className="relative h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center will-transform"
          style={{ y: section2Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <Feature />
        </motion.div>
      </section>
      <section className="h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: section3Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <Section3 />
        </motion.div>
      </section>

      <section className="h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: section4Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <Section4 />
        </motion.div>
      </section>

      <section className="h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: section5Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <Section5 />
        </motion.div>
      </section>

      {/* Section 6 - About */}
      <section id="about" className="h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: section6Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <Section6 />
        </motion.div>
      </section>

      {/* Section 7 - Blog */}
      <section id="blog" className="h-[100dvh]">
        <Section7 />
      </section>

      {/* Section 8 - Contact Us */}
      <section id="contact-us" className="h-[100dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: windowWidth > 600 ? section8Y : mobileSection8Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <ContactUsForm />
        </motion.div>
      </section>
      <section className="h-[50dvh] ">
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
          style={{ y: windowWidth > 600 ? section9Y : mobileSection9Y }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="container">
            <Footer />
          </div>
        </motion.div>
      </section>

      {/* </div> */}
    </div>
  );
}
