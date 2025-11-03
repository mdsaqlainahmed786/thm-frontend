"use client";
import { useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, easeInOut, useMotionValue, useSpring } from "framer-motion";
import { physics } from "@/app/(main-app)/landing/SmoothScroll";
import { useDeviceType } from "@/utils/getDeviceType";
const THMMockup = () => {
    const ref = useRef<HTMLImageElement | null>(null);
    const [prevScroll, setPrevScroll] = useState(0);
    const { scrollY } = useScroll();
    const [windowWidth, setWindowWidth] = useState(0);

    const {deviceType} = useDeviceType();

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, [windowWidth]);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setPrevScroll(latest);
        // update(latest, prevScroll);
    });
    const position = [100, 360];
    const position2 = [220, 680];
    let x1 = useTransform(useSpring(scrollY, physics), position, [-480, 0]);
    let y1 = useTransform(useSpring(scrollY, physics), position, [-200, 0]);
    let s1 = useTransform(useSpring(scrollY, physics), position, ["0.8", "1"]);
    let r1 = useTransform(useSpring(scrollY, physics), position, ["-15deg", "0deg"]);

    let x2 = useTransform(useSpring(scrollY, physics), position, [-300, 0]);
    let y2 = useTransform(useSpring(scrollY, physics), position, [-173, 0]);
    let s2 = useTransform(useSpring(scrollY, physics), position, ["0.7", "1"]);
    let r2 = useTransform(useSpring(scrollY, physics), position, ["-17deg", "0deg"]);

    let x3 = useTransform(useSpring(scrollY, physics), position, [400, 0]);
    let y3 = useTransform(useSpring(scrollY, physics), position, [-400, 0]);
    let s3 = useTransform(useSpring(scrollY, physics), position, ["0.8", "1"]);
    let r3 = useTransform(useSpring(scrollY, physics), position, ["15deg", "0deg"]);

    const marginTop = useTransform(useSpring(scrollY, physics), position2, ["0px", "800px"]);
    // const marginTop = useTransform(scrollY, position2, ["0px", "800px"]);
    const mainDivY = useSpring(
        useTransform(scrollY, [600, 800], [0, -400]),
          { stiffness: 50, damping: 45 }
    );
    const scrollUp = deviceType === "tab" ? 0 : 40;

    return (
        <motion.div className="flex container w-full flex-wrap md:flex-nowrap will-transform"
            style={{
                // marginTop,
                willChange: 'transform, width, height',
                transformStyle: "preserve-3d",
                y: (windowWidth < 600 && prevScroll >= 800) ? mainDivY : undefined
            }}  >
            <div className="w-full order-2 md:basis-1/4 md:order-1">
                <div className="flex flex-col justify-around items-center h-full overflow-hidden">
                    <div className="h-39 overflow-hidden">
                        <motion.h2 className="font-bold md:pe-3 text-[32px] md:text-[20px] lg:text-[28px] leading-tight text-white text-center md:text-left"
                            initial={{ y: 250 }}
                            animate={{ y: prevScroll <= 500 ? 250 : scrollUp }}
                            transition={{
                                type: 'tween',
                                duration: .7,
                                delay: 0.3,
                            }}  >

                            Ratings go beyond a simple experience
                        </motion.h2>
                    </div>

                    <p></p>
                </div>
            </div>
            <div className="w-full order-1 md:order-2 md:basis-2/4 flex justify-center items-center">
                <div className="relative flex justify-center items-center transition-all duration-500 w-[280px] md:w-[380px]" >
                    <img src="/images/phone-mockup.png" className="relative z-10" />
                    <div className="w-[450px] h-[600px] md:w-[800px] md:h-[800px] absolute z-0" style={{ background: "url('/images/background-pattern.webp')", backgroundSize: "cover", backgroundPosition: "center" }} >
                    </div>
                    <div className="absolute top-[132px] right-[9px] md:top-45 md:right-8 z-20" >
                        <div className="flex flex-col md:gap-3">
                            <motion.img src="/images/frame-0.png" className="rounded-xl max-w-[260px] md:max-w-[318px] will-transform"
                                ref={ref}
                                style={{
                                    x: x1,
                                    y: y1,
                                    rotate: r1,
                                    scale: s1,
                                    willChange: 'transform, width, height',
                                    transformStyle: "preserve-3d"
                                }} />
                            <div className="flex gap-[12px] md:gap-2.5 justify-center md:justify-between">
                                <motion.img src="/images/frame.png" className="rounded-xl h-[140px] md:h-49 will-transform"
                                    ref={ref}
                                    style={{
                                        x: x2,
                                        y: y2,
                                        rotate: r2,
                                        scale: s2,
                                        willChange: 'transform, width, height',
                                        transformStyle: "preserve-3d"
                                    }} />
                                <motion.img src="/images/frame-1.png" className="rounded-xl h-[140px] md:h-49 will-transform"
                                    style={{
                                        x: x3,
                                        y: y3,
                                        rotate: r3,
                                        scale: s3,
                                        willChange: 'transform, width, height',
                                        transformStyle: "preserve-3d"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full order-3 md:order-3 md:basis-1/4">
                <div className="flex flex-col justify-around items-center h-full overflow-hidden">
                    <div className="h-39 overflow-hidden">
                        <motion.h2 className="font-bold text-[32px] md:text-[20px] lg:text-[28px] md:ps-3 leading-tight text-white text-center md:text-left "
                            initial={{ y: 250 }}
                            animate={{ y: prevScroll <= 800 ? 250 : scrollUp }}
                            transition={{
                                type: 'tween',
                                duration: .7,
                                delay: .3,
                            }}

                        >
                            They serve as a crucial resource for others
                        </motion.h2>
                    </div>
                    <div className="h-39 md:h-52 overflow-hidden">
                        <motion.p className="font-bold text-[32px] md:text-[20px] lg:text-[28px] md:ps-3 leading-tight text-white text-center md:text-left "
                            initial={{ y: 250 }}
                            animate={{ y: prevScroll <= 1100 ? 250 : scrollUp }}
                            transition={{
                                type: 'tween',
                                duration: .7,
                                delay: .3,
                            }}
                        >
                            Helping them navigate choices and ensuring they make informed decisions for a better overall experience
                        </motion.p>
                    </div>


                </div>
            </div>
        </motion.div >
    )
}

export default THMMockup;