"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionValueEvent, } from "framer-motion";
import { useEffect, useState } from "react";
import { useSpring } from "framer-motion";
import { physics } from "@/app/(main-app)/landing/SmoothScroll";
import { useDeviceType } from "@/utils/getDeviceType";

const imageList = [
    "/svg/create-post.svg",
    "/svg/explore.svg",
    "/svg/connect.svg",
    "/svg/share-memories.svg",
    "/svg/easy-booking.svg",
    "/svg/rate-review.svg",
    "/svg/earn-reward.svg",
];



const Feature = () => {
    const { scrollY } = useScroll();

    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const springY = useSpring(scrollY, physics);

    const { deviceType } = useDeviceType();

    useEffect(() => {
        console.log("Device Type:", deviceType, typeof deviceType);
    }, [deviceType]); // <- Triggered whenever deviceType updates


    useMotionValueEvent(springY, "change", (latest) => {
        const thresholds = [2801, 3101, 3401, 3801, 4101, 4401, 4701];
        const index = thresholds.findLastIndex((v) => latest >= v);
        setActiveIndex(index); // -1 means "none shown"
    });

    useMotionValueEvent(springY, "change", (latest) => {
        const thresholds = [2801, 3101, 3401, 3801, 4001, 4301, 4701];
        const index = thresholds.findLastIndex((v) => latest >= v);
        setActiveTabIndex(index); // -1 means "none shown"
    });



    const position = [1501, 1900]
    const x = useTransform(springY, position, [400, -400]);
    // const y = useTransform(springY, position, [0, 20]);

    //Hotel media does more then just rate Done
    const backgroundPosition = useTransform(springY, position, ['0%', '120%']);

    const position2 = [1900, 2100]
    let opacity = useTransform(springY, position2, ["0.0", "1"]);
    // let y = useTransform(springY, position2, [-30, 0]);
    let scale = useTransform(springY, position2, ["0.8", "1"]);



    // x movement: moves from 450px right to center
    const xStart = window.innerWidth * .3; // start from 40vw
    const x1 = useTransform(springY, [2100, 2600], [xStart, 20]);


    // y movement: moves from -100px up to center (or whatever you want)
    const y1Start = window.innerHeight * .5;
    // console.log("y1Start: ",y1Start)
    let y1 = useTransform(springY, [2100, 2600], [y1Start, 150]);

    const mobileY1 = useTransform(springY, [2300, 2600], [y1Start, 50]);
    const tabY1 = useTransform(springY, [2300, 2600], [y1Start, 100]);



    const wordsY = useTransform(
        springY,
        [0, 2800, 2801, 3101, 3401, 3801, 4101, 4401, 4701],
        [700, 700, 465, 388, 316, 245, 170, 100, 27]
    );
    const mobileWordsY = useTransform(
        springY,
        [0, 2600, 2701, 3101, 3401, 3801, 4101, 4401, 4701],
        [700, 700, 380, 330, 260, 200, 130, 100, 30]
    );

    const tabWordsY = useTransform(
        springY,
        [0, 2800, 2801, 3101, 3401, 3801, 4101, 4401, 4701],
        [700, 700, 465, 388, 316, 245, 170, 100, 27]
    );

    const wordsLineX = useSpring(
        useTransform(scrollY, [5000, 5050], [0, -1200])
        , { stiffness: 60, damping: 30 }
    );

    const iconsX = useSpring(
        useTransform(scrollY, [5000, 5050], [0, 1200])
        , { stiffness: 60, damping: 30 }
    );
    // const tabIconsX = useSpring(
    //     useTransform(scrollY, [5000, 5050], [0, 1200])
    //     , { stiffness: 60, damping: 30 }
    // );
    // console.log("x1: ", x1);
    return (
        <div className="container h-full overflow-hidden">
            <div className="relative min-h-full min-w-full ">
                <motion.div className="flex justify-center items-center text-center min-h-screen min-w-full flex-col "
                    style={{
                        x: wordsLineX,
                    }}
                >
                    <motion.p className="text-7xl absolute font-bold font-quicksand duration-[1.3s] leading-normal w-[3000px]"
                        style={{
                            overflow: "hidden",
                            background: "linear-gradient(90deg, #000, #fff, #000)",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "40%",
                            WebkitBackgroundClip: "text",
                            x: x,
                            // top: "50%",
                            // scale,
                            //  bottom: ,
                            backgroundPosition,
                            WebkitTextFillColor: "rgba(255, 255, 255, 0)",
                        }} >
                        Hotel Media does more than just rate
                    </motion.p>

                    <motion.p className="text-4xl sm:text-6xl md:text-[30px] xl:text-5xl md:left-[40%] absolute font-bold font-quicksand leading-normal text-[#565656]"
                        style={{
                            opacity,
                            // x: ["phone", "tab"].includes(deviceType) ? 0 : x1,
                            // y: deviceType === "pc" ? y1 : 0, // y only for pc, 0 otherwise
                            scale,
                            top: deviceType === "tab" ? tabY1 : deviceType === "phone" ? mobileY1 : "auto", // top only for phone/tab
                            bottom: deviceType === "pc" ? y1 : 0,
                            left: ["phone", "tab"].includes(deviceType) ? "auto" : x1,
                        }}
                    >
                        It allows User to
                    </motion.p>

                    <div
                        className={`absolute overflow-hidden h-[360px] w-[400px] bottom-[50px] md:w-[500px] md:h-[500px] md:bottom-[100px] lg:bottom-[155px] md:left-[270px] xl:left-[450px] z-9 `}>

                        <motion.div className="flex flex-col gap-[25px] sm:gap-12 text-start h-full ps-4 md:ps-[1px]"
                            style={{
                                y: deviceType === "phone" ? mobileWordsY : deviceType === "tab" ? tabWordsY : wordsY
                            }}
                        >
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Create Post
                            </motion.span>

                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Explore
                            </motion.span>
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Connect
                            </motion.span>
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Share Memories
                            </motion.span>
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Easy booking
                            </motion.span>
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Rate and Review
                            </motion.span>
                            <motion.span
                                className="text-[40px] sm:text-[50px] md:text-[40px] xl:text-[51px] text-primary font-quicksand font-bold"

                            >
                                Earn Reward
                            </motion.span>
                        </motion.div>
                    </div>


                </motion.div>
                {/* <div className="absolute grid grid-cols-2 gap-16.5 h-100 right-[100px]"> */}

                {(deviceType === "tab" ? activeTabIndex : activeIndex) >= 0 && (
                    <motion.div
                        className=" w-[360px] h-[250px] top-[170px] sm:w-[400px] md:top-[245px] xl:w-[450px] lg:h-[305px] absolute sm:right-[25%] lg:right-5 lg:top-auto lg:bottom-[300px] overflow-hidden"
                        style={{
                            x: iconsX,
                            // y: windowWidth < 600 ? -220 : undefined
                        }}
                    >
                        {imageList.map((src, index) => (
                            <motion.img
                                key={index}
                                src={src}
                                initial={{ opacity: 0, y: 50 }}
                                animate={(deviceType === "tab" ? activeTabIndex : activeIndex) === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full object-contain will-transform"
                            />
                        ))}
                    </motion.div>
                )}

            </div>
        </div>

    )
}

export default Feature;