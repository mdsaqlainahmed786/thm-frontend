import AppConfig from "@/config/constants";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent, useSpring } from "framer-motion";
const Navbar = () => {
    const Links = [
        {
            name: 'Home',
            link: '/'
        },
        {
            name: 'Features',
            link: '/'
        },
        {
            name: 'About',
            link: '/'
        },
        {
            name: 'Blog',
            link: '/'
        },
        {
            name: 'Contact Us',
            link: '/'
        }
    ];
    const [openMenu, setOpenMenu] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, [windowWidth]);
    const handleMenu = () => {
        setOpenMenu(!openMenu);
    }

    return (
        // <div>



        <section className=" md:mt-auto">

            <motion.div
                className="menu-bar-div sm:hidden w-full h-screen py-3 px-8 flex flex-col gap-8 absolute bg-black z-99999 will-transform"
                initial={{ y: -1000 }}
                animate={{ y: openMenu ? 0 : -1000 }}
                transition={{ duration: 1 }}
            >
                <div className="menu-bar flex justify-end items-center" >

                    <Image src="/svg/cross-bar.svg" alt="menu-bar" height={30} width={30} className="max-h-[35px] max-w-[35px] " onClick={handleMenu} />
                </div>
                <div className="flex flex-col justify-start">
                    <ul className="flex flex-col gap-8">
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                Home
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                Features
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                About
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                Blog
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                Become a member
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/#"} className="text-[22px] text-white font-bold " >
                                Contact Us
                            </Link>
                        </li>
                    </ul>

                </div>
            </motion.div>
            <nav className="flex px-2.5 py-3 bg-[#59595933] items-center justify-between backdrop-blur-[54px] rounded-[36px] m-7 min-w-5xl">
                <div className="min-w-46">
                    <Image src={'/images/logo/logo.svg'} alt={AppConfig.APP_NAME + ' Logo'} width={80} height={80} className="h-13 w-13 ps-1.5" />
                </div>
                <div className="max-sm:hidden">
                    {Links && Links.map((link, index) => {
                        return (<Link key={index} className="text-black dark:text-white text-sm px-3 py-1.5 font-semibold tracking-wide hover:dark:text-primary hover:text-primary" href={link.link}>{link.name}</Link>)
                    })}
                </div>
                <div className="min-w-46 max-sm:hidden">
                    <button className="text-base font-normal text-white leading-5 px-5 py-4 bg-[#242424] rounded-[80px] group relative after:content[''] after:w-45 after:h-0 after:rounded-none after:bg-primary  after:absolute after:-bottom-[70px] after:-left-0.5 after:hover:w-45 after:hover:h-45 after:hover:rounded-full z-10 after:transition-all after:duration-[1.2s] overflow-hidden" style={{
                        boxShadow: "-2.24px 2.13px 5px 0px #00000080 inset, 2.13px -2.13px 5px 0px #00000080 inset"
                    }}>
                        <span className="relative z-20">
                            Become a member
                        </span>
                    </button>
                </div>
                {
                    windowWidth < 600 && !openMenu ?
                        <div className="flex justify-end items-center ">
                            <Image src="/svg/hamburger.svg" alt="menu-bar" height={30} width={30} className="max-h-[35px] max-w-[35px] me-4" onClick={handleMenu} />
                        </div> : ""
                }

            </nav>
        </section>
        // </div>

    );
};

export default Navbar;
