import { useEffect, useState } from "react";

export const useDeviceType = () => {

   const [deviceType, setDeviceType] = useState<"phone" | "tab" | "pc">("pc");
   const [windowWidth, setWindowWidth] = useState(0);
   const [windowHeight, setWindowHeight] = useState(0);

   useEffect(() => {

      const handleResize = () => {
         const windWidth = window.innerWidth;
         const windHeight = window.innerHeight;
         setWindowHeight(windHeight);
         setWindowWidth(windWidth);
         if (windWidth <= 600) {
            setDeviceType("phone");
         } else if (windWidth <= 850) {
            setDeviceType("tab");
         } else {
            setDeviceType("pc");
         }
      };

      handleResize(); // Run once on mount
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return { deviceType, windowWidth, windowHeight };
};


export const getDeviceSizeCategory = () => {
   if (typeof window === "undefined") return "unknown"; // SSR fallback
   const width = window.innerWidth;
   const height = window.innerHeight;

   const aspectRatio = width / height;

   const isLaptopSized =
      width >= 1150 && width <= 1600 &&
      height >= 700 && height <= 1000 &&  // Slightly safer lower bound
      aspectRatio > 1.3 && aspectRatio < 2;  // Rule out square or ultra-wide

   return isLaptopSized ? "13-14-inch-laptop" : "other";
};


