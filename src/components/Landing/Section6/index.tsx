"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { useState } from "react";
const Section6 = () => {

   const { scrollY } = useScroll();
   const [scrollVal, setScrollVal] = useState(0);

   useMotionValueEvent(scrollY, "change", (latestValue) => {
      // console.log("scrollY:", latestValue);  // Log the latest scrollY value
      setScrollVal(latestValue);
   });
   
   const iconsLeftX = useSpring(
      useTransform(scrollY, [8301, 8310, 8700, 8701], [-700, 0, 0, -700]),
      { stiffness: 50, damping: 30 }
   );
   const iconsRightX = useSpring(
      useTransform(scrollY, [8301, 8310, 8700, 8701], [700, 0, 0, 700]),
      { stiffness: 50, damping: 30 }
   );
   const iconsDownY = useSpring(
      useTransform(scrollY, [8301, 8310, 8700, 8701], [1500, 0, 0, 1500]),
      { stiffness: 50, damping: 30 }
   );
   const iconsUpY = useSpring(
      useTransform(scrollY, [8301, 8310, 8700, 8701], [-1200, 0, 0, -1200]),
      { stiffness: 50, damping: 30 } 
   );
   
   return (
      <motion.div className="container flex justify-center items-center h-full ">
         <motion.div className="flex h-full md:py-[100px]" >

            <div className="flex justify-center flex-col items-center relative">

               <div className="relative w-full flex justify-center ">
                  <motion.span className="text-[50px] font-bold text-[#FFFFFF] mb-[100px] text-center"
                     style={{ y: iconsUpY }}
                  >
                     About

                  </motion.span>
                  <motion.img

                     src={"/svg/review-small.svg"}
                     alt="review-small-icon" width={90} height={80}
                     style={{
                        boxShadow: "0px 3.55px 7.09px #00000038,-1.32px 1.26px 2.96px #0000004D inset,1.26px -1.26px 2.96px #0000004D inset",
                        y: iconsUpY, 
                        x: iconsLeftX
                     }}
                     className="absolute top-[-70px] md:top-0 left-0 md:left-20 "
                  />
                  <motion.img
                     style={{
                         y: iconsUpY,
                         x: iconsRightX }}
                     src={"/svg/star-small.svg"}
                     alt="review-small-icon"
                     width={90} height={80}
                     className=" absolute top-[-70px] md:top-0 right-0 md:right-20"
                  />
               </div>

               <motion.div className="relative "
                  style={{ y: iconsUpY }}
               >


                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        Hotel Media is a mobile app that combines hotel reviews with
                     </motion.p>

                  </div>
                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        social media features. Users can rate hotels, bars, pubs,
                     </motion.p>

                  </div>
                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        nightclubs, restaurants, cafes, homestays, and marriage
                     </motion.p>

                  </div>
                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        banquets, share feedback, post photos, and engage with other
                     </motion.p>

                  </div>
                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        travelers. The app offers hotel search, event creation, and
                     </motion.p>

                  </div>
                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        personalized tailored experience. It's designed to help users
                     </motion.p>

                  </div>

                  <div className="overflow-hidden">

                     <motion.p className="text-center text-[18px] sm:text-[22px] md:text-[36px] font-medium text-[#FFFFFF] leading-[40px] md:leading-[60px]"
                        initial={{ y: 100 }}
                        animate={{ y: scrollVal > 8410 ? 0 : 100 }}
                        transition={{
                           type: 'tween',
                           duration: 1.6,
                           delay: 1.7,
                        }}
                     >
                        make informed  decisions for their trips.
                     </motion.p>

                  </div>




                  <motion.img
                     style={{ x: iconsLeftX }}
                     src={"/svg/tray.svg"}
                     alt="tray-icon"
                     width={55} height={55}
                     className="absolute top-[-50px] left-0 md:top-0 md:left-[-80px] h-[40px] w-[40px] md:h-[52px] md:w-[52] "
                  />
                  <motion.img
                     style={{ x: iconsRightX }}
                     src={"/svg/home.svg"}
                     alt="home-icon"
                     width={55} height={55}
                     className="absolute top-[-50px] right-0 md:top-0 md:right-[-80px] h-[40px] w-[40px] md:h-[52px] md:w-[52] "
                  />
                  <motion.img
                     style={{ x: iconsLeftX }}
                     src={"/svg/hotel-sm.svg"}
                     alt="hotel-sm-icon"
                     width={55} height={55}
                     className="absolute bottom-[-20px] left-0 md:bottom-0  md:left-[-80px] h-[40px] w-[40px] md:h-[52px] md:w-[52] "
                  />
                  <motion.img
                     style={{ x: iconsRightX }}
                     src={"/svg/ceremony.svg"}
                     alt="ceremony-icon"
                     width={55} height={55}
                     className="absolute bottom-[-20px] right-0 md:bottom-0  md:right-[-80px] h-[40px] w-[40px] md:h-[52px] md:w-[52] "
                  />
                  <motion.img
                     style={{ y: iconsDownY }}
                     src={"/svg/bar-counter.svg"}
                     alt="bar-counter-icon"
                     width={55} height={55}
                     className="absolute bottom-[-75px] left-[45%] md:bottom-[-150px]  md:left-[49%] h-[40px] w-[40px] md:h-[52px] md:w-[52] "
                  />
               </motion.div>

            </div>

         </motion.div>

      </motion.div>
   )
};


export default Section6;