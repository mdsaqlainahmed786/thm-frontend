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
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDeviceSizeCategory, useDeviceType } from "@/utils/getDeviceType";

export default function Landing() {

    const { scrollY } = useScroll();
    const [scrollVal, setScrollVal] = useState(0);

    const [windowWidth, setWindowWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [innerHeight, setInnerHeight] = useState(0);


    useEffect(() => {
        const handleResize = () => {
            const { innerWidth, innerHeight } = window;

            setWindowWidth(innerWidth);
            setInnerHeight(innerHeight);
            //  console.log("height: ", height);
            console.log("innerHeight: ", innerHeight);
            console.log("windowWidth: ", innerWidth);
            let updatedHeight = 1300;
            const isTabletLandscape =
                innerWidth > 850 && innerWidth <= 1400 && innerHeight <= 800;
            if (isTabletLandscape) {
                updatedHeight = 1450;
            } else if (innerWidth <= 640) {
                updatedHeight = innerHeight < 750 ? 1830 : 1300;
            } else if (innerWidth <= 850) {
                updatedHeight = 1000;
            } else if (innerWidth > 1400 && innerHeight >= 750 && innerHeight <= 800) {
                updatedHeight = 1450; // 14" MacBook case
            } else if (innerHeight > 800 && innerHeight < 900 && innerWidth > 1400) {
                updatedHeight = 1300;
            } else {
                updatedHeight = 1200;
            }

            setHeight(updatedHeight);

        };

        window.addEventListener("resize", handleResize);
        handleResize(); // run once on mount

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { deviceType } = useDeviceType();
    useEffect(() => {
        console.log("height: ", height);
    }, [height, deviceType])

    // console.log("Landing; ", windowWidth)

    useMotionValueEvent(scrollY, "change", (latestValue) => {
        // console.log("scrollY:", latestValue);  // Log the latest scrollY value
        setScrollVal(latestValue);
    });

    const section1Y = useSpring(
        useTransform(scrollY, [0, 400, 1500, 1600], [0, -280, -280, -1500]),
        { stiffness: 60, damping: 45 }
    );

    const section2Y = useSpring(
        useTransform(scrollY, [1500, 1600], [900, 0])
        , { stiffness: 50, damping: 30 }
    );

    const section3Y = useSpring(
        useTransform(scrollY, [5030, 5040], [1200, 0])
        , { stiffness: 60, damping: 40 }
    );

    const section4Y = useSpring(
        useTransform(scrollY, [6500, 6550], [1200, 0])
        , { stiffness: 50, damping: 30 }
    );
    const section5Y = useSpring(
        useTransform(scrollY, [7700, 7701], [1200, 0])
        , { stiffness: 50, damping: 30 }
    );

    const section6Y = useSpring(
        useTransform(scrollY, [8300, 8350], [-1200, 0])
        , { stiffness: 50, damping: 30 }
    );

    const section8Y = useSpring(
        useTransform(scrollY, [8901, 8950, 9250, 9260], [1200, 200, 200, -200])
        , { stiffness: 30, damping: 25 }
    );

    const mobileSection8Y = useSpring(
        useTransform(scrollY, [8901, 8950, 9250, 9300], [1200, 0, 0, -1000])
        , { stiffness: 40, damping: 30 }
    );
    const tabSection8Y = useSpring(
        useTransform(scrollY, [8901, 8950, 9250, 9300], [1200, 0, 0, -300])
        , { stiffness: 40, damping: 30 }
    );
    const landScapeTab8Y = useSpring(
        useTransform(scrollY, [8901, 8950, 9250, 9300], [1200, 0, 0, -400])
        , { stiffness: 40, damping: 30 }
    );

    const section9Y = useSpring(
        useTransform(scrollY, [9250, 9350], [1200, 580])
        , { stiffness: 50, damping: 30 }
    );
    const mobileSection9Y = useSpring(
        useTransform(scrollY, [9270, 9320], [1200, 20])
        , { stiffness: 50, damping: 30 }
    );
    const tabSection9Y = useSpring(
        useTransform(scrollY, [9300, 9350], [1200, 540])
        , { stiffness: 50, damping: 30 }
    );

    const landScapeTab9Y = useSpring(
        useTransform(scrollY, [9300, 9350], [1200, 250])
        , { stiffness: 30, damping: 25 }
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
    const phone = deviceType === "phone";
    const tab = deviceType === "tab";


    const section8YScroll = phone ? mobileSection8Y : tab ? tabSection8Y : (innerHeight <= 700 && (windowWidth > 850 && windowWidth <= 1400)) ? landScapeTab8Y : section8Y;

    const section9YScroll = phone ? mobileSection9Y : tab ? tabSection9Y : (innerHeight <= 700 && (windowWidth > 850 && windowWidth <= 1400)) ? landScapeTab9Y : section9Y;
    const device = getDeviceSizeCategory();

    useEffect(() => {
        const maxScroll = 9450;

        const handleWheel = (e: any) => {
            const currentScroll = window.pageYOffset;
            // If at max scroll and trying to scroll down, prevent it
            if (currentScroll >= maxScroll && e.deltaY > 0) {
                e.preventDefault();
            }
        };

        const unsubscribe = scrollY.on("change", (value) => {
            if (value >= maxScroll) {
                document.addEventListener("wheel", handleWheel, { passive: false });
            } else {
                document.removeEventListener("wheel", handleWheel);
            }
        });

        return () => {
            unsubscribe();
            document.removeEventListener("wheel", handleWheel);
        };
    }, [scrollY]);

    return (
        // <div className="container flex justify-center items-center">
        <div className={`relative landing mx-auto`}
            style={{ height: `${height}vh` }}
        >
            {/* <Image src="/svg/hamburger.svg" alt="menu-bar" /> */}
            {/* Section 1 */}

            <section className="relative container min-h-screen one">
                <motion.div
                    className="fixed  left-0 w-full flex items-center justify-center flex-col will-transform"
                    style={{ y: section1Y }} // Apply transform on Y-axis
                >
                    <motion.div style={{ y: heroY }}>
                        <Navbar />
                        <HeroSection />
                    </motion.div>

                    <motion.div style={{ y: windowWidth > 700 ? thmY : 0 }} className="will-transform">
                        <THMMockup />
                    </motion.div>


                </motion.div>

            </section>

            {/* Section 2 */}
            <section className="relative container h-[100dvh] two "

            >
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center will-transform"
                    style={{ y: section2Y }}
                    transition={{

                        duration: .7
                    }}
                >
                    <Feature />
                </motion.div>
            </section>
            <section className="h-[100dvh] container three">
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
                    style={{ y: section3Y }}
                // transition={{

                //     duration: .7
                // }}
                >
                    <Section3 />
                </motion.div>
            </section>

            <section className="h-[100dvh] container four">
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
                    style={{ y: section4Y }}
                    transition={{

                        duration: .7
                    }}
                >
                    <Section4 />
                </motion.div>
            </section>

            <section className="h-[100dvh] container five">
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
                    style={{ y: section5Y }}
                    transition={{

                        duration: .7
                    }}
                >
                    <Section5 />
                </motion.div>
            </section>

            <section className="h-[100dvh] six">
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden will-transform"
                    style={{ y: section6Y }}
                    transition={{

                        duration: .7
                    }}
                >
                    <Section6 />
                </motion.div>
            </section>

            <section className="h-[100dvh] container seven">
                <Section7 />
            </section>

            <section className="h-[100dvh] container eight">
                <motion.div
                    className="fixed top-0 left-0 w-full flex items-center justify-center  overflow-hidden will-transform"
                    style={{
                        y: section8YScroll,
                        height: (device === "other") ? "100%" : "auto"
                    }}
                // transition={{

                //     duration: .7
                // }}
                >
                    <ContactUsForm />
                </motion.div>
            </section>
            <section className="h-[50vh] nine">
                <motion.div
                    className="fixed top-0 left-0 w-full flex items-end justify-center overflow-hidden will-transform"

                    style={{
                        y: (device === "other") ? section9YScroll : 0,
                        bottom: (scrollVal > 9350 && (device === "13-14-inch-laptop")) ? "10px" : "auto",
                        display: (device === "13-14-inch-laptop" && scrollVal < 9350) ? "none" : ""

                    }}

                // transition={{
                //     delay: .3,
                //     duration: .7
                // }}

                >
                    <div className="container h-full flex justify-center items-end">
                        <Footer />
                    </div>

                </motion.div>
            </section>
            <div style={{ height: "1px" }} />



            {/* </div> */}
        </div>

    );
}
