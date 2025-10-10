"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface IContentArray {
   heading: string;
   text: string;
   icon: string;
   date: string;
   time: string;
}
interface IBtn {
   rate: boolean;
   profile: boolean;
   solution: boolean;
}
const contentArray: IContentArray[] = [

   {
      heading: "Rate Your Stay",
      text: "Share honest reviews and rate your accommodations. Your feedback matters and helps others make informed decisions.",
      icon: "/svg/review-big.svg",
      date: "27 sep 2024",
      time: "1 hour"
   },
   {
      heading: "No Fake Profiles",
      text: "Hotel Media ensures an authentic community by eliminating fake accounts. Engage with real travelers and venues.",
      icon: "/images/portrait-mockup-2.png",
      date: "27 sep 2024",
      time: "1 hour"
   },
   {
      heading: "One App Solution",
      text: "Share honest reviews and rate your accommodations. Your feedback matters and helps others make informed decisions.",
      icon: "/images/mockup-natural-titanium.png",
      date: "27 sep 2024",
      time: "1 hour"
   },
]

const Section7 = () => {

   const { scrollY } = useScroll();
   const [scrollVal, setScrollVal] = useState(0);
   const xTarget = useMotionValue(0); // manual control
   const scrollRightLeft = useSpring(xTarget, {
      stiffness: 60,
      damping: 25,
   });
   const [windowWidth, setWindowWidth] = useState(0);

   useEffect(() => {
      setWindowWidth(window.innerWidth);
   }, [windowWidth]);

   useMotionValueEvent(scrollY, "change", (latestValue) => {
      // console.log("scrollY:", latestValue);  // Log the latest scrollY value
      setScrollVal(latestValue);
   });



   const [btn, setBtn] = useState<IBtn>({
      rate: true,
      profile: false,
      solution: false
   });

   const handleBtn = (key: keyof IBtn) => {
      setBtn({
         rate: false,
         profile: false,
         solution: false,
         [key]: true
      });
   }
   useEffect(() => {
      if (windowWidth < 600) {
         if (btn.rate) {
            xTarget.set(0);
         } else if (btn.profile) {
            xTarget.set(-265);
         } else if (btn.solution) {
            xTarget.set(-535);
         }
      } else {
         if (btn.rate) {
            xTarget.set(0);
         } else if (btn.profile) {
            xTarget.set(-350);
         } else if (btn.solution) {
            xTarget.set(-700);
         }
      }

   }, [btn]);


   const iconsLeftX = useSpring(
      useTransform(scrollY, [10200, 10250], [-700, 0]),
      { stiffness: 50, damping: 30 }
   );

   const iconsRightX = useSpring(
      useTransform(scrollY, [10200, 10250, 10550], [1700, 0, 0]),
      { stiffness: 50, damping: 30 }
   );

   const iconsUpY = useSpring(
      useTransform(scrollY, [0, 9699, 9700, 10600, 10601, 11000, 11001], [-1200, -1200, 0, 0, -400, -400, -1200]),
      { stiffness: 50, damping: 30 }
   );
   const mobileIconsUpY = useSpring(
      useTransform(scrollY, [0, 9699, 9700, 10600, 10601], [-1200, -1200, 0, 0, -1200]),
      { stiffness: 50, damping: 30 }
   );



   return (
      <motion.div
         className="fixed top-0 left-0 w-full h-full flex items-center justify-center  overflow-hidden"
         style={{ y: windowWidth > 600 ? iconsUpY : mobileIconsUpY }}
         transition={{

            duration: .7
         }}
      >
         <div className="container ">
            <div className="flex flex-col justify-between md:flex-row">
               <div className="w-full md:basis-1/3 overflow-hidden mb-10 md:mb-0"  >
                  <motion.div className="flex flex-col justify-center items-start md:items-center gap-8 md:gap-15"
                     style={{ x: iconsLeftX }}
                  >
                     <h4 className="text-white text-[51px] font-bold leading-[65px] text-left">
                        Recent <br /> Partners
                     </h4>
                     <div className="min-w-46 text-left">
                        <button className="text-base font-normal text-white leading-5 px-5 py-4 bg-[#242424] rounded-[80px] group relative after:content[''] after:w-45 after:h-0 after:rounded-none after:bg-primary  after:absolute after:-bottom-[70px] after:-left-0.5 after:hover:w-45 after:hover:h-45 after:hover:rounded-full z-10 after:transition-all after:duration-[1.2s] overflow-hidden" style={{
                           boxShadow: "-2.24px 2.13px 5px 0px #00000080 inset, 2.13px -2.13px 5px 0px #00000080 inset"
                        }}>
                           <span className="relative z-20">
                              Read More
                           </span>
                        </button>
                     </div>

                  </motion.div>
               </div>

               <div className="w-full md:basis-3/5 overflow-hidden">
                  <div className="flex flex-col gap-10">
                     <motion.div style={{ x: iconsRightX }}>
                        <motion.div className=" flex gap-5 md:gap-10 w-max will-transform"
                           style={{ x: scrollRightLeft }}
                        >
                           {
                              contentArray?.map((items, i) => (
                                 <div className="w-[250px] md:w-[320px] md:h-[440px] flex-shrink-0 flex flex-col justify-between rounded-[16px] p-5 bg-[#242424]" key={i}>

                                    <span className="text-[#FFFFFF] text-[26px] font-bold">
                                       {items?.heading}
                                    </span>
                                    <span className="text-[#9C9C9C] text-[16px] font-medium">
                                       {items?.text}
                                    </span>
                                    <div>
                                       <Image src={items?.icon} alt="review-small" width={280} height={200} />
                                    </div>
                                    <div className="flex justify-between">
                                       <div className="flex justify-start gap-2">
                                          <div className="flex justify-start items-center">
                                             <Image src={"/svg/calender.svg"} width={24} height={24} alt="calender-icon" />
                                          </div>

                                          <span className="flex justify-start items-center">
                                             {items?.date}
                                          </span>
                                       </div>
                                       <div className="flex justify-end">
                                          <div className="flex justify-start items-center">
                                             <Image src={"/svg/time-outline.svg"} alt="time-outline-icon" width={24} height={24} />
                                          </div>
                                          <span>{items?.time}</span>
                                       </div>

                                    </div>
                                 </div>
                              ))
                           }

                        </motion.div>
                     </motion.div>

                     {
                        scrollVal >= 10250 &&
                        <motion.div className="min-w-46 text-left duration-1500 flex gap-3 items-center h-14"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: scrollVal > 10250 ? 1 : 0 }}
                           transition={{ duration: 1.4, delay: .6 }}

                        >

                           <motion.button
                              onClick={() => handleBtn("rate")}
                              initial={false}
                              animate={{
                                 width: btn.rate ? 100 : 20,
                                 height: btn.rate ? 40 : 20,
                                 borderRadius: btn.rate ? "20px" : "50%",
                                 // padding:btn.rate ? "10px 20px" : "auto",
                                 backgroundColor: "#242424",
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className=" text-white text-sm font-medium overflow-hidden flex items-center justify-center shadow-inner"
                           >
                              <motion.span
                                 animate={{
                                    opacity: btn.rate ? 1 : 0,
                                    marginLeft: btn.rate ? 8 : 0,
                                    width: btn.rate ? "auto" : 0,
                                    // padding:btn.rate ? "10px 20px" : "auto",
                                 }}
                                 transition={{ duration: 0.5 }}
                                 className="whitespace-nowrap"
                              >
                                 Rate
                              </motion.span>
                           </motion.button>

                           <motion.button
                              onClick={() => handleBtn("profile")}
                              initial={false}
                              animate={{
                                 width: btn.profile ? 100 : 20,
                                 height: btn.profile ? 40 : 20,
                                 borderRadius: btn.profile ? "20px" : "50%",
                                 // padding:btn.profile ? "10px 20px" : "auto",
                                 backgroundColor: "#242424",
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className=" text-white text-sm font-medium overflow-hidden flex items-center justify-center shadow-inner"
                           >
                              <motion.span
                                 animate={{
                                    opacity: btn.profile ? 1 : 0,
                                    marginLeft: btn.profile ? 8 : 0,
                                    width: btn.profile ? "auto" : 0,
                                    // padding:btn.rate ? "10px 20px" : "auto",
                                 }}
                                 transition={{ duration: 0.5 }}
                                 className="whitespace-nowrap"
                              >
                                 Profiles
                              </motion.span>
                           </motion.button>



                           <motion.button
                              onClick={() => handleBtn("solution")}
                              initial={false}
                              animate={{
                                 width: btn.solution ? 100 : 20,
                                 height: btn.solution ? 40 : 20,
                                 borderRadius: btn.solution ? "20px" : "50%",
                                 // padding:btn.solution ? "10px 20px" : "auto",
                                 backgroundColor: "#242424",
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className=" text-white text-sm font-medium overflow-hidden flex items-center justify-center shadow-inner"
                           >
                              <motion.span
                                 animate={{
                                    opacity: btn.solution ? 1 : 0,
                                    marginLeft: btn.solution ? 8 : 0,
                                    width: btn.solution ? "auto" : 0,
                                    // padding:btn.rate ? "10px 20px" : "auto",
                                 }}
                                 transition={{ duration: 0.5 }}
                                 className="whitespace-nowrap"
                              >
                                 Solutions
                              </motion.span>
                           </motion.button>
                        </motion.div>
                     }

                  </div>

               </div>
            </div>
         </div>

      </motion.div>
   )
};


export default Section7;