"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring, AnimatePresence, delay } from "framer-motion";
import { useEffect, useState } from "react";

interface Child {
   id: number;
   name: string;
   icon: string
}

interface Parent {
   id: number;
   title: string;
   children: Child[];
}
const dataArray: Parent[] = [
   {
      id: 1,
      title: "hotelsHomeStays",
      children: [
         { id: 1, name: "Unlimited Bookings", icon: "/svg/favorite-1.svg" },
         { id: 2, name: "Customer Engagement", icon: "/svg/favorite-1.svg" },
         { id: 3, name: "Feedback Driven Resolution", icon: "/svg/clock-1.svg" },
         { id: 4, name: "Job Opportunities", icon: "/svg/clock-1.svg" },
         { id: 5, name: "Event promotion ", icon: "/svg/favorite-1.svg" },
         { id: 6, name: "Dedicated Hotel Profile", icon: "/svg/dedicate.svg" },
         { id: 7, name: "Rate and Review", icon: "/svg/rejected-1.svg" },
      ]
   },
   {
      id: 2,
      title: "restaurantsCafes",
      children: [
         { id: 1, name: "Event & Bulk Booking Management", icon: "/svg/favorite-1.svg" },
         { id: 2, name: "Table Reservation", icon: "/svg/clock-1.svg" },
         { id: 3, name: "Customer Engagement", icon: "/svg/clock-1.svg" },
         { id: 4, name: "Rate and Review", icon: "/svg/rejected-1.svg" },
         { id: 5, name: "Direct Communication ", icon: "/svg/dedicate.svg" },
         { id: 6, name: "Promote Offers", icon: "/svg/favorite-1.svg" },

      ]
   },
   {
      id: 3,
      title: "barsNightClubs",
      children: [
         { id: 1, name: "Expose services", icon: "/svg/favorite-1.svg" },
         { id: 2, name: "Guest reach", icon: "/svg/clock-1.svg" },
         { id: 3, name: "Share Promotions", icon: "/svg/clock-1.svg" },
         { id: 4, name: "Guest Feedback", icon: "/svg/rejected-1.svg" },
         { id: 5, name: "Event promotion", icon: "/svg/dedicate.svg" },
         { id: 6, name: "Table Reservation", icon: "/svg/favorite-1.svg" },
      ]
   },
   {
      id: 4,
      title: "marriageBanquets",
      children: [
         { id: 1, name: "High-Quality Media Showcase", icon: "/svg/favorite-1.svg" },
         { id: 2, name: "Dedicated Platform for Banquets", icon: "/svg/favorite-1.svg" },
         { id: 3, name: "Event Promotion", icon: "/svg/clock-1.svg" },
         { id: 4, name: "Direct bookings", icon: "/svg/clock-1.svg" },
         { id: 5, name: "Rate and Review", icon: "/svg/rejected-1.svg" },
         { id: 6, name: "Enhanced Visibility", icon: "/svg/dedicate.svg" },
         { id: 7, name: "Follower Interaction", icon: "/svg/favorite-1.svg" }
      ]
   }
];



const Section5 = () => {
   const { scrollY } = useScroll();
   const [scrollVal, setScrollVal] = useState(0);
   const [windowWidth, setWindowWidth] = useState(0);

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      handleResize(); // set initial value
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // console.log("windowWidth: ", windowWidth)
   useMotionValueEvent(scrollY, "change", (latestValue) => {
      // console.log("scrollY:", latestValue);  // Log the latest scrollY value
      setScrollVal(latestValue);
   });
   const [appClick, setAppClick] = useState({
      hotelsHomeStays: true,
      restaurantsCafes: false,
      barsNightClubs: false,
      marriageBanquets: false
   });
   const handleApp = (key: string) => {
      setAppClick({
         hotelsHomeStays: key === "hotelsHomeStays",
         restaurantsCafes: key === "restaurantsCafes",
         barsNightClubs: key === "barsNightClubs",
         marriageBanquets: key === "marriageBanquets",

      });
   };
   const firstHeadY = useSpring(
      useTransform(scrollY, [8650, 8700, 8701], [1200, 0, 30]),
      { stiffness: 60, damping: 30 }
   );

   const SecondDiv = useSpring(
      useTransform(scrollY, [8650, 8900, 9300], [1200, 1200, 50]),
      { stiffness: 60, damping: 30 }
   );
   const [scrollPassed, setScrollPassed] = useState(false);
  const [delayDone, setDelayDone] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         if (scrollVal > 9200) {
         // setScrollPassed(true);
            setTimeout(() => {
               setDelayDone(true); // wait 1 sec after crossing 9300
            }, 1000);
         }
         // if (scrollVal < 9300) {
         // // setScrollPassed(false);
         //    setDelayDone(false);
         // }

      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, [scrollVal]);

   const appNums: (keyof typeof appClick)[] = ["hotelsHomeStays", "restaurantsCafes", "barsNightClubs", "marriageBanquets"];
   const values = ["Hotels & Home Stays", "Restaurants & Cafes", "Bars & Night Clubs", "Marriage Banquets"];

   // 1. Get the active title from state:
   const activeKey = Object.keys(appClick).find(key => appClick[key as keyof typeof appClick]);

   // 2. Find the matching data from dataArray:
   const activeSection = dataArray.find(section => section.title === activeKey);



   return (
      <motion.div className="container"
         initial={{ opacity: 1 }}
         animate={{ opacity: scrollVal > 9700 ? 0 : 1 }}
         transition={{ duration: 1, delay: .6 }}
      >
         <motion.div className="flex flex-col justify-center items-center will-transform"
            style={{
               y: firstHeadY,
               // willChange: 'transform'

            }}

         >
            <p className="text-[35px] md:text-[52px] font-quicksand text-[#565656] text-center leading-[45px] md:leading-[70px]">
               Benefits for  <span className="text-[#FFF]">Businesses</span>
            </p>

         </motion.div>

         <motion.div className="md:relative flex justify-center will-transform"
            style={{
               y: SecondDiv,


            }}

         >
            <div className="w-[100%] sm:w-[90%] md:w-[75%] xl:w-[80%] flex flex-col justify-between">
               <div className="flex items-center w-[95%] sm:w-[100%] md:justify-center overflow-auto "
                  style={{
                     border: windowWidth < 600 ? "1px solid rgba(255,255,255,.4)" : "",
                     borderRadius: windowWidth < 600 ? "10px" : "",
                     padding: windowWidth < 600 ? "20px 15px" : "",
                     alignItems: windowWidth < 600 ? "center" : ""

                  }}
               >

                  { appNums?.map((appName, index) => (
                     <div
                        key={index}
                        className={`
                          md:pb-3 px-5 cursor-pointer w-full whitespace-nowrap text-[16px] md:text-[20px] text-center md:border-b-2 font-medium
                          ${appClick[appName]
                              ? windowWidth < 600
                                 ? "text-[#4169E1]" // only text color changes on small screen
                                 : "border-b-[#4169E1] text-[#4169E1]" // both change on big screen
                              : " text-[#FFFFFF99]"
                           }
                          `}
                        onClick={() => handleApp(appName)}
                     >

                        {appName === "hotelsHomeStays" ? values[0] : appName === "restaurantsCafes" ? values[1] : appName === "barsNightClubs" ? values[2] : appName === "marriageBanquets" && values[3]} App
                     </div>
                  ))}
               </div>

               {
                  windowWidth > 600 ?
                     <div className="flex justify-center relative items-center h-[600px] md:h-[900px]">

                        <div className="h-[420px] w-[350px] absolute z-10 bottom-[150px] rounded-md overflow-hidden">
                           <Image
                              src="/images/frame-6.webp"
                              alt="blur-background"
                              width={350}
                              height={420}
                              // placeholder="blur"
                              // blurDataURL="/images/frame-6-blur.webp" // pre-generated tiny image
                              className="object-cover w-full h-full rounded-md"
                           />
                        </div>


                        <div className="overflow-hidden flex justify-center absolute z-30 bottom-[155px]">
                           <Image
                              src="/images/food-image.webp"
                              width={220}
                              height={435}
                              alt="full-image"
                              // placeholder="blur"
                              // blurDataURL="/images/food-image-blur.webp" // pre-generated tiny image
                              className="lg:h-[435px] lg:w-[230px] w-[210px] h-[360px] translate-y-[65px]"
                           />
                        </div>

                        <AnimatePresence mode="wait">
                           {delayDone && appClick.hotelsHomeStays && (
                              <motion.img
                                 key="hotelsHomeStays"
                                 initial={{ opacity: .7, width: 0, height: 0 }}
                                 animate={{ opacity: 1, width: 1000, height: 820 }}
                                 exit={{ opacity: .7, width: 0, height: 0 }}
                                 transition={{ duration: 0.8, type: "tween" }}
                                 src="/images/frame-1.webp"
                                 alt="frame-1"
                                 className="absolute z-20"
                              />
                           )}

                           {appClick.restaurantsCafes && (
                              <motion.img
                                 key="restaurantsCafes"
                                 initial={{ opacity: .7, width: 0, height: 0 }}
                                 animate={{ opacity: 1, width: 1000, height: 820 }}
                                 exit={{ opacity: .7, width: 0, height: 0 }}
                                 transition={{ duration: 0.8, type: "tween" }}
                                 src="/images/frame-2.webp"
                                 alt="frame-2"
                                 className="absolute z-20"
                              />
                           )}

                           {appClick.barsNightClubs && (
                              <motion.img
                                 key="barsNightClubs"
                                 initial={{ opacity: .7, width: 0, height: 0 }}
                                 animate={{ opacity: 1, width: 1000, height: 820 }}
                                 exit={{ opacity: .7, width: 0, height: 0 }}
                                 transition={{ duration: 0.8, type: "tween" }}
                                 src="/images/frame-3.webp"
                                 alt="frame-3"
                                 className="absolute z-20"
                              />
                           )}

                           {appClick.marriageBanquets && (
                              <motion.img
                                 key="marriageBanquets"
                                 initial={{ opacity: .7, width: 0, height: 0 }}
                                 animate={{ opacity: 1, width: 1000, height: 820 }}
                                 exit={{ opacity: .7, width: 0, height: 0 }}
                                 transition={{ duration: 0.8, type: "tween" }}
                                 src="/images/frame-4.webp"
                                 alt="frame-4"
                                 className="absolute z-20"
                              />
                           )}
                        </AnimatePresence>

                     </div> :
                     <div className="flex justify-center h-[700px]">
                        <AnimatePresence mode="wait">
                           <div className="container h-[650px] rounded-[20px] overflow-hidden mt-6"

                              style={{
                                 backgroundImage: "url('/images/shape_gradient2.png')",
                                 backgroundSize: "cover",
                                 backgroundRepeat: "no-repeat"
                              }}
                           >

                              <motion.div className="bottom-div grid grid-cols-2 gap-4 p-5"
                                 key={activeSection?.id} // unique per tab change
                                 initial={{ y: 550, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 exit={{ y: -200, opacity: 0 }}
                                 transition={{ duration: 1, ease: "easeInOut" }}
                              >
                                 {activeSection?.children?.map((data) => (
                                    <div
                                       key={data.id}
                                       className="flex flex-col justify-center items-center py-4 px-7 rounded-[10px] gap-3 bg-[#0560ff]"
                                    >
                                       <Image
                                          src={data.icon}
                                          alt={`${data.name}-icon`}
                                          width={35}
                                          height={35}
                                       />
                                       <span className="text-[14px] font-bold text-white text-center">
                                          {data.name}
                                       </span>
                                    </div>
                                 ))}
                              </motion.div>

                           </div>

                        </AnimatePresence>
                     </div>
               }


            </div>

         </motion.div>

      </motion.div>
   )
};


export default Section5;