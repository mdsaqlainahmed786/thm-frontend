"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";

const ForgotPasswordForm = ({ isModal = false, onSuccess }: { isModal?: boolean, onSuccess?: () => void }) => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
    const initialValues = {
        email: '',
        otp: "",
        resetToken: "",
        password: "",
        confirmPassword: ""
    }
    const [formInputs, setFormInputs] = useState(initialValues);
    const [loading, setLoading] = useState(false);
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
                setLoading(true);
                const response = await apiRequest.post('/auth/forgot-password', { email: formInputs.email });
                if (response.data && response.data.status) {
                    toast.success(response.data.message);
                    setStep(1);
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            } finally {
                setLoading(false);
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
                setLoading(true);
                const response = await apiRequest.post('/auth/forgot-password/verify-otp', { email: formInputs.email, otp: formInputs.otp });
                if (response.data && response.data.status && response.data?.data?.resetToken) {
                    toast.success(response.data.message);
                    setFormInputs({ ...formInputs, resetToken: response.data?.data?.resetToken })
                    setStep(2);
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            } finally {
                setLoading(false);
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
                setLoading(true);
                const response = await apiRequest.post('/auth/reset-password', { email: formInputs.email, password: formInputs.password, resetToken: formInputs.resetToken });
                if (response.data && response.data.status) {
                    toast.success(response.data.message);
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.push('/admin/login');
                    }
                    return true;
                }
                toast.error(response.data.message ?? "Something went wrong");
            } catch (error: any) {
                toast.error(error?.message ?? "Something went wrong");
            } finally {
                setLoading(false);
            }
        } else {
            // toast.error('Form has errors. Please correct them');
        }
    }
    return (
        <>
            <div className={`${step === 0 ? '' : 'hidden'} transition-all duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
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
                            value={loading ? "Sending..." : "Send password reset email"}
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
                        />
                    </div>
                    {!isModal && (
                        <div className="mt-6 text-center">
                            <p>
                                <Link href="/admin/login" className="text-primary">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </form>
            </div>
            <div className={`${step === 1 ? '' : 'hidden'} transition-all duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    OTP Verification
                </h2>
                <span className="mb-1.5 block font-medium">Please enter the code sent to your email <b>({formInputs.email})</b></span>
                <form onSubmit={handleOTPSubmit} >
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            OTP
                        </label>
                        <div className="flex gap-2 justify-center">
                            {otpValues.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length <= 1) {
                                            const newOtp = [...otpValues];
                                            newOtp[index] = val;
                                            setOtpValues(newOtp);
                                            setFormInputs({ ...formInputs, otp: newOtp.join("") });
                                            if (val && index < 4) {
                                                document.getElementById(`otp-${index + 1}`)?.focus();
                                            }
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
                                            document.getElementById(`otp-${index - 1}`)?.focus();
                                        }
                                    }}
                                    className="w-12 h-12 text-center rounded-lg border border-stroke bg-transparent text-xl font-bold text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-5">
                        <input
                            type="submit"
                            value={loading ? "Verifying..." : "Verify OTP"}
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
                        />
                    </div>
                    {!isModal && (
                        <div className="mt-6 text-center">
                            <p>
                                <Link href="/admin/login" className="text-primary">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </form>
            </div>
            <div className={`${step === 2 ? '' : 'hidden'} transition-all duration-1000 p-4 sm:p-12.5 xl:p-17.5`}>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Reset Your Password
                </h2>
                <span className="mb-1.5 block font-medium">Please choose a new password that is at least 8 characters long, contains a mix of letters and numbers, and includes at least one special character.</span>
                <form onSubmit={handlePasswordSubmit} >
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                required
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                value={formInputs.password}
                                onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 120 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                required
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                value={formInputs.confirmPassword}
                                onChange={(e) => setFormInputs({ ...formInputs, confirmPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="mb-5">
                        <input
                            type="submit"
                            value={loading ? "Resetting..." : "Reset Password"}
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
                        />
                    </div>
                    {!isModal && (
                        <div className="mt-6 text-center">
                            <p>
                                <Link href="/admin/login" className="text-primary">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </>


    );
}
export default ForgotPasswordForm;
