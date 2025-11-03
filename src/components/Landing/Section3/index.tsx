"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useDeviceType } from "@/utils/getDeviceType";

const Section3 = () => {
   const { scrollY } = useScroll();
   
   const {deviceType} = useDeviceType()

   const svg1Y = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [-1200, 0, 0, -1000]),
      { stiffness: 60, damping: 35 }
   );

   const svg2Y = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [-1200, -70, -70, -1000]),
      { stiffness: 60, damping: 35 }
   );

   const svgTab2Y = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [-1200, -40, -40, -1000]),
      { stiffness: 60, damping: 35 }
   );

   const svg1X = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [-500, -150, -150, -500]),
      { stiffness: 60, damping: 35 }
   );

   const svgTab1X = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [-500, -60, -60, -500]),
      { stiffness: 60, damping: 35 }
   );

   const svg3X = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [500, 150, 150, 500]),
      { stiffness: 60, damping: 35 }
   );
   const svgTab3X = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [500, 60, 60, 500]),
      { stiffness: 60, damping: 35 }
   );

   const listY = useSpring(
      useTransform(scrollY, [5700, 6100, 6500, 6601], [1200, -50, -50, -1200]),
      { stiffness: 60, damping: 35 }
   );

   const firstHeadY = useSpring(
      useTransform(scrollY, [5300, 5350], [0, -1200]),
       { stiffness: 40, damping: 30 }
   );

   const secondHeadY = useSpring(
      useTransform(scrollY, [5300, 5400, 6500, 6601], [1200, -50, -50, -1200]),
      { stiffness: 60, damping: 40 }
   );



   return (
      <div className="container">
         <motion.div
            className="svg-div flex justify-center" >
            <motion.img
               src="/images/posts.webp"
               alt="post-img"
               width={203}
               height={140}
               className="md:h-[140px] md:w-[203px] "
               style={{ y: svg1Y, x: deviceType === "tab" ? svgTab1X : svg1X }}

            />
            <motion.img
               src="/images/event-details.webp"
               alt="event-details-img"
               width={203}
               height={140}
               className="h-[200px] w-[300px] md:h-[140px] md:w-[203px] "
               style={{ y: svg2Y }}
            />
            <motion.img
               src="/images/recipt.webp"
               alt="recipt-img"
               width={203}
               height={140}
               className="md:h-[140px] md:w-[203px] "
               style={{ y: svg1Y, x:deviceType === "tab" ? svgTab3X : svg3X }}
            />

         </motion.div>
         <div className="flex flex-col font-quicksand">
            <motion.span className="text-[#fff] text-[55px] md:text-[85px] h-[85px] text-center" 
               style={{
                  y: firstHeadY
               }}
            >
               Features
            </motion.span>
            <motion.div className="text-[#fff] text-[55px] md:text-[85px] h-[85px] flex justify-center items-center gap-8 mb-3"
               style={{
                  y: secondHeadY
               }}
            >
               Whole <span className="text-[#565656]">In One</span>
            </motion.div>
            <motion.div className="text-[22px] flex-col font-bold flex justify-center items-center"
               style={{
                  y: listY
               }}
            >
               <ul className="list-disc  flex flex-col gap-1 text-[#565656] text-[13px] md:text-[22px]">
                  <li>Manage bookings for hotels, restaurants, bars, events.</li>
                  <li>Effortlessly handle event bookings with seamless tools.</li>
                  <li>Post job openings, connect with potential employees.</li>
               </ul>
               <div className="flex justify-center items-center mt-4">
                  <span className="h-[2px] w-[20px] bg-[white] me-2" />
                  <span className="text-center text-[#4169E1] text-[13px] md:text-[22px]"> it&apos;s all coming together</span>
               </div>

            </motion.div>
         </div>

      </div>
   )
};


export default Section3;