"use client";
import AppConfig from "@/config/constants";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"
import Button from "@/components/Button";
const Footer = () => {
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
            name: 'Privacy Policy',
            link: '/privacy-policy'
        },
        {
            name: 'Terms of Use',
            link: '/terms-and-conditions'
        }
    ]
    return (
        <motion.footer
            initial={{
                scale: 0.6,
                y: 100,
            }}
            whileInView={{
                scale: 1,
                y: 0,
                transition: {
                    type: 'easeOut',
                    duration: 0.5,
                    delay: 0.1,
                    ease: [0.25, 0.25, 0.25, 0.75],
                }
            }}
            className="text-center text-surface/75 bg-black dark:bg-black dark:text-white lg:text-left rounded-[32px] backdrop-blur-[32px] p-3.5 sm:p-4.5 md:p-2.5 lg:p-3 will-transform" style={{
                background: "url('/images/footer-bg.png')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundOrigin: 'border-box',
                backgroundPosition: 'center',
            }}>
            <div className="flex flex-col gap-3.5 sm:gap-4.5 md:gap-4.5 lg:gap-9">
                <div className="mx-6 py-5 text-center md:text-left">
                    <div className="grid-1 grid gap-5 md:gap-8 md:grid-cols-2 lg:grid-cols-4">

                        <div className="flex flex-col gap-3.5 max-md:items-center">
                            <Link href={'/'}>
                                <Image src={'/images/logo/logo.svg'} alt={AppConfig.APP_NAME + ' Logo'} width={80} height={80} className="h-12 w-12" />
                            </Link>
                            <h6 className="md:mb-4 flex items-center justify-center font-semibold text-title-sm2  md:justify-start font-quicksand">
                                Rate, Review, Discover
                            </h6>
                            <p className="text-sm font-normal">
                                Your go-to app for honest reviews and trusted ratings across a wide range of categories.
                            </p>
                        </div>
                        <div className=" ">
                            <div className="flex flex-col mb-4 gap-1 items-center md:items-start">
                                <h6 className=" flex justify-center font-semibold  md:justify-start font-quicksand">
                                    Quick link
                                </h6>
                                <span className="bg-[#4169E1] w-[40px] h-[1px]" />
                            </div>

                            <div className="flex flex-col max-md:items-center gap-3">
                                {
                                    Links && Links.map((link, index) => {
                                        return (
                                            <Link href={link.link} key={index} className="text-sm font-medium font-quicksand flex gap-1 items-center">
                                                <span>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 10.58L6.58 6L2 1.41L3.41 0L9.41 6L3.41 12L2 10.58Z" className="fill-primary" />
                                                    </svg>
                                                </span>
                                                {link.name}
                                            </Link>
                                        )
                                    })
                                }
                            </div>

                        </div>

                        <div>

                            <div className="flex flex-col mb-4 gap-1 items-center md:items-start">
                                <h6 className=" flex justify-center font-semibold  md:justify-start font-quicksand">
                                    Contact
                                </h6>
                                <span className="bg-[#4169E1] w-[40px] h-[1px]" />
                            </div>
                            <p className="mb-4 flex items-start justify-center md:justify-start">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                        <path d="M12.271 12.7121L11.3045 13.668C10.592 14.3666 9.66787 15.2656 8.53117 16.3648C8.18953 16.6952 7.7329 16.8798 7.25768 16.8798C6.78245 16.8798 6.32582 16.6952 5.98418 16.3648L3.14163 13.5996C2.78335 13.2487 2.48534 12.9531 2.24432 12.7121C1.25286 11.7205 0.577678 10.4573 0.304161 9.08203C0.0306448 7.70677 0.171074 6.2813 0.707692 4.98585C1.24431 3.69041 2.15302 2.58318 3.3189 1.80417C4.48479 1.02517 5.85549 0.609375 7.25768 0.609375C8.65987 0.609375 10.0306 1.02517 11.1965 1.80417C12.3623 2.58318 13.271 3.69041 13.8077 4.98585C14.3443 6.2813 14.4847 7.70677 14.2112 9.08203C13.9377 10.4573 13.2625 11.7205 12.271 12.7121ZM9.29331 7.92264C9.29331 7.38276 9.07884 6.86499 8.69709 6.48323C8.31533 6.10147 7.79756 5.88701 7.25768 5.88701C6.71779 5.88701 6.20002 6.10147 5.81827 6.48323C5.43651 6.86499 5.22204 7.38276 5.22204 7.92264C5.22204 8.46253 5.43651 8.9803 5.81827 9.36205C6.20002 9.74381 6.71779 9.95828 7.25768 9.95828C7.79756 9.95828 8.31533 9.74381 8.69709 9.36205C9.07884 8.9803 9.29331 8.46253 9.29331 7.92264Z" fill="#F50000" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium font-quicksand">
                                    {`${AppConfig.COMPANY_ADDRESS.STREET} ${AppConfig.COMPANY_ADDRESS.STREET_1} ${AppConfig.COMPANY_ADDRESS.CITY} ${AppConfig.COMPANY_ADDRESS.STATE} - ${AppConfig.COMPANY_ADDRESS.ZIPCODE}, ${AppConfig.COMPANY_ADDRESS.COUNTRY}`}
                                </span>
                            </p>
                            <p className="mb-4 flex items-start justify-center md:justify-start">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                                        <g clipPath="url(#clip0_3247_113734)">
                                            <path d="M3.20157 10.2902V5.07986L1.58571 3.60159L0.136719 2.78125V9.37067C0.136719 9.87943 0.548916 10.2902 1.0562 10.2902H3.20157Z" fill="#4285F4" />
                                            <path d="M10.5586 10.2901H12.704C13.2128 10.2901 13.6234 9.87785 13.6234 9.37062V2.78125L11.9822 3.72085L10.5586 5.07981V10.2901Z" fill="#34A853" />
                                            <path d="M3.20034 5.07412L2.98047 3.03831L3.20034 1.08984L6.87815 3.84822L10.556 1.08984L10.8019 2.93312L10.556 5.07412L6.87815 7.8325L3.20034 5.07412Z" fill="#EA4335" />
                                            <path d="M10.5586 1.09001V5.07429L13.6234 2.77568V1.54972C13.6234 0.41269 12.3255 -0.235501 11.4168 0.446403L10.5586 1.09001Z" fill="#FBBC04" />
                                            <path d="M0.136719 2.7757L1.5463 3.83293L3.20157 5.07432V1.09004L2.34336 0.446427C1.4331 -0.235529 0.136719 0.412714 0.136719 1.5497V2.7757Z" fill="#C5221F" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3247_113734">
                                                <rect width="13.4853" height="10.1667" fill="white" transform="translate(0.136719 0.167969)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <span className="text-sm font-medium font-quicksand">
                                    {AppConfig.COMPANY_EMAIL}
                                </span>
                            </p>
                            <p className="md:mb-4 flex items-start justify-center md:justify-start">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <path d="M12.8278 9.99748L10.8714 9.77412C10.6414 9.7471 10.4083 9.77257 10.1895 9.8486C9.9707 9.92464 9.772 10.0493 9.60831 10.2131L8.19114 11.6303C6.00468 10.5183 4.22751 8.74113 3.11551 6.55467L4.54038 5.1298C4.87157 4.79861 5.03331 4.33649 4.9794 3.86667L4.75604 1.92576C4.71237 1.55004 4.53206 1.20349 4.24943 0.952106C3.9668 0.70072 3.60159 0.562052 3.22334 0.562501H1.89089C1.02056 0.562501 0.296571 1.28649 0.350486 2.15682C0.758693 8.73434 6.01917 13.9871 12.589 14.3953C13.4593 14.4492 14.1833 13.7253 14.1833 12.8549V11.5225C14.191 10.7446 13.6057 10.0899 12.8278 9.99748Z" fill="#4169E1" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium font-quicksand">
                                    {AppConfig.COMPANY_PHONE_NUMBER}
                                </span>
                            </p>
                        </div>
                        <div>

                            <div className="flex flex-col mb-4 gap-1 items-center md:items-start">
                                <h6 className=" flex justify-center font-semibold  md:justify-start font-quicksand">
                                    Download App
                                </h6>
                                <span className="bg-[#4169E1] w-[40px] h-[1px]" />
                            </div>
                            <div className="flex justify-center md:flex-col gap-1.5">
                                <Button.PlayStore></Button.PlayStore>
                                <Button.AppStore></Button.AppStore>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b border-white/30"></div>
                <div className="flex max-sm:flex-col max-sm:gap-2 max-sm:py-2 items-center justify-between py-1 px-5">
                    <div className="">
                        <span className="text-sm font-quicksand font-normal text-white/80">© {new Date().getFullYear()} The Hotel media. All rights reserved.</span>
                    </div>
                    <div className="flex justify-center gap-4">
                        <a href="#!" className="h-8 w-8 bg-primary text-white rounded-full flex justify-center items-center">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" className="fill-current" />
                            </svg>
                        </a>
                        <a href="#!" className="h-8 w-8 bg-primary text-white rounded-full flex justify-center items-center">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28004 9.09 5.11004 7.38 3.00004 4.79C2.63004 5.42 2.42004 6.16 2.42004 6.94C2.42004 8.43 3.17004 9.75 4.33004 10.5C3.62004 10.5 2.96004 10.3 2.38004 10V10.03C2.38004 12.11 3.86004 13.85 5.82004 14.24C5.19088 14.4129 4.53008 14.4369 3.89004 14.31C4.16165 15.1625 4.69358 15.9084 5.41106 16.4429C6.12854 16.9775 6.99549 17.2737 7.89004 17.29C6.37371 18.4905 4.49405 19.1394 2.56004 19.13C2.22004 19.13 1.88004 19.11 1.54004 19.07C3.44004 20.29 5.70004 21 8.12004 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" className="fill-current" />
                            </svg>

                        </a>
                        <a href="#!" className="h-8 w-8 bg-primary text-white rounded-full flex justify-center items-center">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.0281 2C14.1531 2.003 14.7241 2.009 15.2171 2.023L15.4111 2.03C15.6351 2.038 15.8561 2.048 16.1231 2.06C17.1871 2.11 17.9131 2.278 18.5501 2.525C19.2101 2.779 19.7661 3.123 20.3221 3.678C20.8308 4.17773 21.2243 4.78247 21.4751 5.45C21.7221 6.087 21.8901 6.813 21.9401 7.878C21.9521 8.144 21.9621 8.365 21.9701 8.59L21.9761 8.784C21.9911 9.276 21.9971 9.847 21.9991 10.972L22.0001 11.718V13.028C22.0025 13.7574 21.9948 14.4868 21.9771 15.216L21.9711 15.41C21.9631 15.635 21.9531 15.856 21.9411 16.122C21.8911 17.187 21.7211 17.912 21.4751 18.55C21.2243 19.2175 20.8308 19.8223 20.3221 20.322C19.8223 20.8307 19.2176 21.2242 18.5501 21.475C17.9131 21.722 17.1871 21.89 16.1231 21.94L15.4111 21.97L15.2171 21.976C14.7241 21.99 14.1531 21.997 13.0281 21.999L12.2821 22H10.9731C10.2433 22.0026 9.5136 21.9949 8.78408 21.977L8.59008 21.971C8.35269 21.962 8.11535 21.9517 7.87808 21.94C6.81408 21.89 6.08808 21.722 5.45008 21.475C4.78291 21.2241 4.17852 20.8306 3.67908 20.322C3.17003 19.8224 2.77619 19.2176 2.52508 18.55C2.27808 17.913 2.11008 17.187 2.06008 16.122L2.03008 15.41L2.02508 15.216C2.00665 14.4868 1.99831 13.7574 2.00008 13.028V10.972C1.99731 10.2426 2.00465 9.5132 2.02208 8.784L2.02908 8.59C2.03708 8.365 2.04708 8.144 2.05908 7.878C2.10908 6.813 2.27708 6.088 2.52408 5.45C2.77577 4.7822 3.1703 4.17744 3.68008 3.678C4.17923 3.16955 4.78327 2.77607 5.45008 2.525C6.08808 2.278 6.81308 2.11 7.87808 2.06C8.14408 2.048 8.36608 2.038 8.59008 2.03L8.78408 2.024C9.51327 2.00623 10.2427 1.99857 10.9721 2.001L13.0281 2ZM12.0001 7C10.674 7 9.40223 7.52678 8.46455 8.46447C7.52686 9.40215 7.00008 10.6739 7.00008 12C7.00008 13.3261 7.52686 14.5979 8.46455 15.5355C9.40223 16.4732 10.674 17 12.0001 17C13.3262 17 14.5979 16.4732 15.5356 15.5355C16.4733 14.5979 17.0001 13.3261 17.0001 12C17.0001 10.6739 16.4733 9.40215 15.5356 8.46447C14.5979 7.52678 13.3262 7 12.0001 7ZM12.0001 9C12.394 8.99993 12.7842 9.07747 13.1482 9.22817C13.5122 9.37887 13.8429 9.5998 14.1215 9.87833C14.4002 10.1569 14.6212 10.4875 14.772 10.8515C14.9229 11.2154 15.0005 11.6055 15.0006 11.9995C15.0006 12.3935 14.9231 12.7836 14.7724 13.1476C14.6217 13.5116 14.4008 13.8423 14.1223 14.121C13.8437 14.3996 13.513 14.6206 13.1491 14.7714C12.7851 14.9223 12.395 14.9999 12.0011 15C11.2054 15 10.4424 14.6839 9.87976 14.1213C9.31715 13.5587 9.00108 12.7956 9.00108 12C9.00108 11.2044 9.31715 10.4413 9.87976 9.87868C10.4424 9.31607 11.2054 9 12.0011 9M17.2511 5.5C16.9196 5.5 16.6016 5.6317 16.3672 5.86612C16.1328 6.10054 16.0011 6.41848 16.0011 6.75C16.0011 7.08152 16.1328 7.39946 16.3672 7.63388C16.6016 7.8683 16.9196 8 17.2511 8C17.5826 8 17.9005 7.8683 18.135 7.63388C18.3694 7.39946 18.5011 7.08152 18.5011 6.75C18.5011 6.41848 18.3694 6.10054 18.135 5.86612C17.9005 5.6317 17.5826 5.5 17.2511 5.5Z" className="fill-current" />
                            </svg>
                        </a>
                        <a href="#!" className="h-8 w-8 bg-primary text-white rounded-full flex justify-center items-center">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" className="fill-current" />
                            </svg>

                        </a>
                    </div>
                </div>
            </div>
        </motion.footer >
    );
};

export default Footer;
{/* <footer className="flex px-2.5 py-3 bg-[#59595933] items-center justify-between backdrop-blur-[54px] rounded-[36px] m-7 min-w-5xl">
                <div className="ps-1.5">
                    <Image src={'/images/logo/logo.svg'} alt={AppConfig.APP_NAME + ' Logo'} width={80} height={80} className="h-13 w-13" />
                </div>
                <div>
                    {Links && Links.map((link, index) => {
                        return (<Link className="text-black dark:text-white text-sm px-3 py-1.5 font-semibold tracking-wide hover:text-primary" href={link.link}>{link.name}</Link>)
                    })}
                </div>
                <div>
                    <button className="text-base font-normal text-white leading-5 px-5 py-4 bg-[#242424] rounded-[80px]" style={{

                        boxShadow: "-2.24px 2.13px 5px 0px #00000080 inset, 2.13px -2.13px 5px 0px #00000080 inset"
                    }}>
                        Become a member
                    </button>
                </div>
            </footer> */}