"use client";
import { useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, easeInOut, useMotionValue, useSpring } from "framer-motion";
import { physics } from "@/app/(main-app)/landing/SmoothScroll";
const AllInOne = () => {
    return (
        <div className="flex flex-col gap-2.5 justify-center items-center my-100">
            <h3 className="text-[84px] font-bold text-white leading-tight font-quicksand">Whole <span>In One</span></h3>
            <p className="text-title-sm2 font-bold text-[#565656] font-quicksand">Search, look, book and rate in one place</p>
            <p className="text-title-sm2 font-bold text-primary font-quicksand"> -- it’s all coming together</p>
        </div>
    )
}

export default AllInOne;