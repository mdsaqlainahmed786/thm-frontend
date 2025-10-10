"use client";
import { useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, easeInOut, useMotionValue, useSpring } from "framer-motion";
import { physics } from "@/app/(main-app)/landing/SmoothScroll";
const THMMockup = () => {
    const ref = useRef<HTMLImageElement | null>(null);
    const [prevScroll, setPrevScroll] = useState(0);
    const { scrollY } = useScroll({
        // target: ref,
        // layoutEffect: true,
        // offset: ["start start", "end start"],
    });
    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setPrevScroll(latest);
        update(latest, prevScroll);
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
    function update(latest: number, prev: number): void {
        console.log(latest, "latest", prev, "prev")
    }
    return (
        <motion.div className="flex" style={{
            marginTop,
            willChange: 'transform, width, height',
            transformStyle: "preserve-3d"
        }}  >
            <div className="basis-1/4">
                <div className="flex flex-col justify-around items-center h-full overflow-hidden">
                    <motion.h2 className="font-bold text-[32px] leading-tight text-white"
                        initial={{
                            y: 40,
                            opacity: 0,
                        }}
                        animate={{
                            y: prevScroll <= 400 ? 40 : 0,
                            opacity: prevScroll <= 400 ? 0 : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.6,
                            delay: 0.2,
                            ease: [0.25, 0.25, 0.25, 0.75],
                        }}
                    >
                        Ratings go beyond a simple experience
                    </motion.h2>
                    <p></p>
                </div>
            </div>
            <div className="basis-2/4 flex justify-center items-center">
                <div className="relative flex justify-center items-center transition-all duration-500 w-[380px]" >
                    <img src="/images/phone-mockup.png" className="relative z-10" />
                    <div className="w-[800px] h-[800px] absolute z-0" style={{ background: "url('/images/background-pattern.webp')", backgroundSize: "cover", backgroundPosition: "center" }} >
                    </div>
                    <div className="absolute top-45 right-8 z-20" >
                        <div className="flex flex-col gap-3">
                            <motion.img src="/images/frame-0.png" className="rounded-xl max-w-[318px]"
                                ref={ref}
                                style={{
                                    x: x1,
                                    y: y1,
                                    rotate: r1,
                                    scale: s1,
                                    willChange: 'transform, width, height',
                                    transformStyle: "preserve-3d"
                                }} />
                            <div className="flex gap-2.5">
                                <motion.img src="/images/frame.png" className="rounded-xl h-49"
                                    ref={ref}
                                    style={{
                                        x: x2,
                                        y: y2,
                                        rotate: r2,
                                        scale: s2,
                                        willChange: 'transform, width, height',
                                        transformStyle: "preserve-3d"
                                    }} />
                                <motion.img src="/images/frame-1.png" className="rounded-xl h-49"
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
            <div className="basis-1/4">
                <div className="flex flex-col justify-around items-center h-full overflow-hidden">
                    <motion.h2 className="font-bold text-[32px] leading-tight text-white"
                        initial={{
                            y: 40,
                            opacity: 0,
                        }}
                        animate={{
                            y: prevScroll <= 400 ? 40 : 0,
                            opacity: prevScroll <= 400 ? 0 : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.8,
                            delay: 0.3,
                            ease: [0.25, 0.25, 0.25, 0.75],
                        }}

                    >
                        They serve as a crucial resource for others
                    </motion.h2>
                    <motion.p className="font-normal text-title-sm2 leading-tight text-white"
                        initial={{
                            y: 40,
                            opacity: 0,
                        }}
                        animate={{
                            y: prevScroll <= 400 ? 40 : 0,
                            opacity: prevScroll <= 400 ? 0 : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.8,
                            delay: 0.6,
                            ease: [0.25, 0.25, 0.25, 0.75],
                        }}
                    >
                        Helping them navigate choices and ensuring they make informed decisions for a better overall experience
                    </motion.p>
                </div>
            </div>
        </motion.div >
    )
}

export default THMMockup;