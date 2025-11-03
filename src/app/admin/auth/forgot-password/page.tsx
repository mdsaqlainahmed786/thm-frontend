import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPassword";
export const metadata: Metadata = {
    title: "Forgot your password?",
};

const SignIn: React.FC = () => {
    return (
        <div className=" h-screen flex justify-center items-center">
            <div className="container">
                <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-2xl">
                    <div className="flex flex-wrap items-center">
                        <div className="hidden w-full xl:block xl:w-1/2">
                            <div className="px-26 py-17.5 text-center">
                                <Link className="mb-5.5 inline-block" href="/">
                                    <Image
                                        className="hidden dark:block"
                                        src={"/images/logo/logo.svg"}
                                        alt="Logo"
                                        width={100}
                                        height={100}
                                    />
                                    <Image
                                        className="dark:hidden"
                                        src={"/images/logo/logo.svg"}
                                        alt="Logo"
                                        width={100}
                                        height={100}
                                    />
                                </Link>
                                <p className="2xl:px-20">
                                    Your go-to app for honest reviews and trusted ratings across a wide range of categories.
                                </p>
                                <span className="mt-15 inline-block">
                                    <Image src="/images/hotel-flat-illustration.jpg" width={1000} height={1000} alt="hotel-flat-illustration" />
                                </span>
                            </div>
                        </div>
                        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                            <ForgotPasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
