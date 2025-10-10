"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
const Section4 = () => {
   const { scrollY } = useScroll();
   const [scrollVal, setScrollVal] = useState(0);
   const [windowWidth, setWindowWidth] = useState(0);

   useEffect(() => {
      setWindowWidth(window.innerWidth);
   }, [windowWidth]);

   useMotionValueEvent(scrollY, "change", (latestValue) => {
      console.log("scrollY:", latestValue);  // Log the latest scrollY value
      setScrollVal(latestValue);
   });
   const firstHeadY = useSpring(
      useTransform(scrollY, [7500, 7550], [1200, 50]),
      { stiffness: 60, damping: 18 }
   );

   const mainHeadY = useSpring(
      useTransform(scrollY, [7800, 7900, 8600, 8601], [0, -200, -200, -1200]),
      { stiffness: 60, damping: 18 }
   );
   const mobileMainHeadY = useSpring(
      useTransform(scrollY, [7800, 7900, 8600, 8601], [0, -90, -90, -1200]),
      { stiffness: 60, damping: 18 }
   );

   const iconsY = useSpring(
      useTransform(scrollY, [8000, 8100], [1000, 150]),
      { stiffness: 60, damping: 18 }
   );

   const iconleftX = useSpring(
      useTransform(scrollY, [8000, 8100], [-1000, 0]),
      { stiffness: 60, damping: 18 }
   );

   const iconrightX = useSpring(
      useTransform(scrollY, [8000, 8100], [1000, 0]),
      { stiffness: 60, damping: 18 }
   );



   return (

      <motion.div className="flex flex-col justify-center items-center "
         style={{
            y: windowWidth > 600 ? mainHeadY : mobileMainHeadY
         }}
      // transition={{duration:.6, type:"tween"}}
      >
         <motion.img
            src="/svg/blu-sheild.svg"
            alt="shield"
            width={355}
            height={220}
            className="w-[260px] md:h-[220px] md:w-[355px] "
         />

         <motion.div className="flex flex-col justify-center items-center gap-10 mb-3"
            style={{
               y: firstHeadY
            }}
         >
            <p className="text-[50px] md:text-[85px] font-quicksand text-[#565656]">
               Your <span className="text-[#FFF]">data</span> is <span className="text-[#FFF]">safe</span>
            </p>
            <p className="text-[18px] md:text-[22px] font-bold text-[#4169E1]">
               we don't share with ads or third parties.
            </p>

         </motion.div>

         <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-11"
            // style={{ y: iconsY, display:scrollVal <5700 ? "none" :"" }}
            style={{
               y: iconsY
            }}
         >
            <motion.div
               style={{

                  x: iconleftX
               }}
               className="bg-white/10 backdrop-blur-[30px] rounded-3xl p-5 relative overflow-hidden will-transform">

               <div className="absolute z-0 top-[-15px] md:top-0 left-10"

               >
                  <motion.svg width="152" height="117" viewBox="0 0 152 117"
                     fill="none" xmlns="http://www.w3.org/2000/svg"
                     //  whileHover={{ scale: 1.1 }}
                     //  whileTap={{ scale: 0.8 }}
                     className="w-[110px] md:w-[152px]"  >
                     <g clipPath="url(#clip0_2740_49149)">
                        <path opacity="0.99" fillRule="evenodd" clipRule="evenodd" d="M79.9976 -35.1484C81.3831 -35.1484 82.7684 -35.1484 84.1539 -35.1484C88.0702 -33.7994 90.0492 -31.0285 90.0914 -26.8359C88.2543 -10.5999 86.3742 5.62912 84.4507 21.8516C96.5241 21.802 108.597 21.8516 120.669 22C124.891 23.5503 126.821 26.5683 126.459 31.0547C126.188 32.5839 125.595 33.9694 124.677 35.2109C106.667 60.9402 88.6566 86.6692 70.6461 112.398C69.276 114.516 67.4454 116.001 65.1539 116.852C63.7684 116.852 62.3831 116.852 60.9976 116.852C57.1483 115.521 55.1694 112.8 55.0601 108.688C56.9503 90.3299 58.8304 71.9733 60.7007 53.6172C50.8044 53.6668 40.9087 53.6172 31.0132 53.4688C25.5524 51.2434 23.8206 47.3344 25.8179 41.7422C42.3441 17.2004 58.8699 -7.34114 75.3961 -31.8828C76.6317 -33.4591 78.1656 -34.5477 79.9976 -35.1484Z" fill="#AAAAAA" />
                     </g>
                     <defs>
                        <clipPath id="clip0_2740_49149">
                           <rect width="152" height="152" fill="white" transform="translate(0 -35)" />
                        </clipPath>
                     </defs>
                  </motion.svg>
               </div>
               <div className="flex">
                  <div className="flex flex-col gap-2.5 justify-end max-w-56 relative z-10">
                     <h4 className="text-title-sm2 font-bold font-quicksand text-[#565656]">No hidden <span className="text-white">charges</span> </h4>
                     <p 
                     className="text-base font-quicksand font-normal text-white">what you see is what you get when booking and using our services.</p>
                  </div>
                  <motion.div className="flex justify-center w-full pt-5"
                     initial={{ scale: 1 }}
                     whileHover={{ scale: 1.3 }}
                     whileTap={{ scale: 0.8 }}
                     transition={{ duration: .6 }}
                  >
                     <img src="/images/no-hidden-charges.svg" className=" md:max-h-56 -mr-10 w-full" height={224} />
                  </motion.div>
               </div>
            </motion.div>

            <motion.div
               style={{
                  // y:iconsY,
                  x: iconrightX
               }}
               className="bg-white/10 backdrop-blur-[30px] rounded-3xl p-5 relative overflow-hidden will-transform">
               <div className="absolute z-0 top-[-15px] md:top-0 left-10">
                  <svg width="152" height="129"
                     viewBox="0 0 152 129" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="w-[110px] md:w-[152px] "
                  >
                     <g clipPath="url(#clip0_2740_49968)">
                        <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M76.1787 -18.1012C89.7456 -19.1147 99.4932 -13.573 105.421 -1.47623C109.648 10.5573 107.224 20.9975 98.1474 29.8441C88.8407 37.0967 78.7469 38.3831 67.8662 33.7035C55.4708 26.4205 50.77 15.6834 53.7646 1.49252C57.4313 -9.45086 64.9028 -15.9821 76.1787 -18.1012Z" fill="white" fillOpacity="0.4" />
                        <path opacity="0.977" fillRule="evenodd" clipRule="evenodd" d="M38.1599 -2.07012C40.5424 -2.10269 42.9174 -2.00371 45.2849 -1.77325C41.7079 12.1217 44.7755 24.2936 54.4881 34.7424C50.6124 38.1615 46.0604 39.9427 40.8318 40.0861C29.088 39.1438 22.1115 32.9095 19.9021 21.383C19.5889 8.53959 25.6749 0.721807 38.1599 -2.07012Z" fill="white" fillOpacity="0.4" />
                        <path opacity="0.989" fillRule="evenodd" clipRule="evenodd" d="M75.858 45.429C91.2278 44.4801 104.29 49.4279 115.045 60.2727C102.009 64.4518 93.3504 73.0612 89.0689 86.1008C87.7757 90.6789 87.3304 95.3298 87.733 100.054C69.0299 100.054 50.3267 100.054 31.6236 100.054C30.214 78.8743 38.4277 62.6946 56.2642 51.5149C62.433 48.1935 68.9642 46.1649 75.858 45.429Z" fill="white" fillOpacity="0.4" />
                        <path opacity="0.977" fillRule="evenodd" clipRule="evenodd" d="M-0.148438 100.055C-0.148438 95.0085 -0.148438 89.9616 -0.148438 84.9148C2.954 67.9074 12.6519 56.4777 28.9453 50.6257C33.8895 49.1229 38.9363 48.628 44.0859 49.1413C28.5606 62.4998 21.4356 79.4713 22.7109 100.055C15.0911 100.055 7.47136 100.055 -0.148438 100.055Z" fill="white" fillOpacity="0.4" />
                        <rect x="94.7031" y="68.4375" width="48" height="48" rx="24" fill="white" fillOpacity="0.4" />
                        <path d="M120.519 88.576C120.519 89.5929 121.344 90.4174 122.36 90.4174H129.437C130.454 90.4174 131.278 91.2418 131.278 92.2587V92.4117C131.278 93.4286 130.454 94.2531 129.437 94.2531H122.36C121.344 94.2531 120.519 95.0775 120.519 96.0944V103.541C120.519 104.558 119.695 105.382 118.678 105.382H118.468C117.451 105.382 116.626 104.558 116.626 103.541V96.0944C116.626 95.0775 115.802 94.2531 114.785 94.2531H107.709C106.692 94.2531 105.867 93.4286 105.867 92.4117V92.2587C105.867 91.2418 106.692 90.4174 107.709 90.4174H114.785C115.802 90.4174 116.626 89.5929 116.626 88.576V81.0758C116.626 80.0588 117.451 79.2344 118.468 79.2344H118.678C119.695 79.2344 120.519 80.0588 120.519 81.0758V88.576Z" fill="white" />
                     </g>
                     <defs>
                        <clipPath id="clip0_2740_49968">
                           <rect width="152" height="152" fill="white" transform="translate(0 -23)" />
                        </clipPath>
                     </defs>
                  </svg>
               </div>
               <div className="flex">
                  <div className="flex flex-col gap-2.5 justify-end max-w-56 relative z-10">
                     <h4 className="text-title-sm2 font-bold font-quicksand text-[#565656]">No fake <span className="text-white">charges</span> </h4>
                     <p className="text-base font-quicksand font-normal text-white">we keep it real.</p>
                  </div>
                  <motion.div className="flex justify-end w-full pt-5"
                     initial={{ scale: 1 }}
                     whileHover={{ scale: 1.1, x: -10 }}
                     whileTap={{ scale: 0.8 }}
                     transition={{ duration: .6 }}
                  >
                     <img src="/images/pro-portrait-mockup-3.png" className="max-w-[180px] md:max-w-70 -mb-5 w-full" height={280} />
                  </motion.div>
               </div>
            </motion.div>
         </motion.div>

      </motion.div>


   )
};


export default Section4;