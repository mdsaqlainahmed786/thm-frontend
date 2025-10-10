"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiRequest from "@/api-services/app-client";
const ForgotPasswordForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const initialValues = {
        email: '',
        otp: "",
        resetToken: "",
        password: "",
        confirmPassword: ""
    }
    const [formInputs, setFormInputs] = useState(initialValues);
    const validate = (step: number) => {
        const { email, otp, password } = formInputs;
        const errors: any = {};
        if (step === 0) {
            if (!email.trim()) {
                errors.email = 'Email is required.';
                toast.error(errors.email);

            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'Email is invalid.';
                toast.error(errors.email);
            }
        }
        if (step === 1) {
            if (!otp.trim()) {
                errors.otp = 'OTP is required.';
                toast.error(errors.otp);
            } else if (otp.length < 5) {
                errors.otp = 'OTP is too short.';
                toast.error(errors.otp);
            }
        }
        if (step === 2) {
            if (!password.trim()) {
                errors.password = 'Password is required.';
                toast.error(errors.password);
            } else if (password.length < 8) {
                errors.password = 'Password is too short.';
                toast.error(errors.password);
            }
        }
        return Object.keys(errors).length === 0;
    };

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validate(step);
        if (isValid) {
            try {
                const response = await apiRequest.post('auth/forgot-password', { email: formInputs.email });
                if (response.data && response.data.status) {
                    toast.success(response.data.message);
                    setStep(1);
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            }

        } else {
            // toast.error('Form has errors. Please correct them');
        }
    }
    const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validate(step);
        if (isValid) {
            try {
                const response = await apiRequest.post('auth/forgot-password/verify-otp', { email: formInputs.email, otp: formInputs.otp });
                if (response.data && response.data.status && response.data?.data?.resetToken) {
                    toast.success(response.data.message);
                    setFormInputs({ ...formInputs, resetToken: response.data?.data?.resetToken })
                    setStep(2);
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            }

        } else {
            // toast.error('Form has errors. Please correct them');
        }
    }
    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validate(step);
        if (isValid) {
            try {
                const response = await apiRequest.post('/auth/reset-password', { email: formInputs.email, password: formInputs.password, resetToken: formInputs.resetToken });
                if (response.data && response.data.status) {
                    toast.success(response.data.message);
                    router.push('/admin/login')
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            }
        } else {
            // toast.error('Form has errors. Please correct them');
        }
    }
    return (
        <>
            <div className={`${step === 0 ? '' : 'hidden'} transition-['display' ] duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Reset your password
                </h2>
                <span className="mb-1.5 block font-medium">Enter your user account's verified email address and we will send you a password reset link.</span>
                <form onSubmit={handleEmailSubmit} >
                    <div className="mb-4" >
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                value={formInputs.email}
                                onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                                required={true}
                            />
                            <span className="absolute right-4 top-4">
                                <svg
                                    className="fill-current"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity="0.5">
                                        <path
                                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                            fill=""
                                        />
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="mb-5">
                        <input
                            type="submit"
                            value="Send password reset email"
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        />
                    </div>
                    <div className="mt-6 text-center">
                        <p>
                            <Link href="/admin/login" className="text-primary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <div className={`${step === 1 ? '' : 'hidden'} transition-all duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    OTP Verification
                </h2>
                <span className="mb-1.5 block font-medium">Please enter the code sent to your email <b>({formInputs.email})</b></span>
                <form onSubmit={handleOTPSubmit} >
                    <div className="mb-4" >
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            OTP
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="Enter otp here"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={formInputs.otp}
                                onChange={(e) => setFormInputs({ ...formInputs, otp: e.target.value })}
                                required={true}
                            />
                            <span className="absolute right-4 top-4">
                                <svg
                                    className="fill-current"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity="0.5">
                                        <path
                                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                            fill=""
                                        />
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="mb-5">
                        <input
                            type="submit"
                            value="Verify OTP"
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        />
                    </div>
                    <div className="mt-6 text-center">
                        <p>
                            <Link href="/admin/login" className="text-primary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <div className={`${step === 2 ? '' : 'hidden'} transition-all duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Reset Your Password
                </h2>
                <span className="mb-1.5 block font-medium">Please choose a new password that is at least 8 characters long, contains a mix of letters and numbers, and includes at least one special character.</span>
                <form onSubmit={handlePasswordSubmit} >
                    <div className="mb-4" >
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter new password here"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={formInputs.password}
                                onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })}
                                required={true}
                            />
                            <span className="absolute right-4 top-4">
                                <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z" fill=""></path><path d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z" fill=""></path></g></svg>
                            </span>
                        </div>
                    </div>
                    <div className="mb-5">
                        <input
                            type="submit"
                            value="Reset Password"
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        />
                    </div>
                    <div className="mt-6 text-center">
                        <p>
                            <Link href="/admin/login" className="text-primary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </>


    );
}
export default ForgotPasswordForm;
