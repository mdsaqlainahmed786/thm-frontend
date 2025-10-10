"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { AuthenticationProvider, HOTEL_DASHBOARD } from "@/types/auth";
import { useRouter } from "next/navigation";
const LoginInForm = () => {
    const router = useRouter();
    const initialValues = {
        email: '',
        password: "",
    }
    const [formInputs, setFormInputs] = useState(initialValues);
    const validate = () => {
        const { email, password } = formInputs;
        const errors: any = {};
        if (!email.trim()) {
            errors.email = 'Email is required.';
            toast.error(errors.email);

        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid.';
            toast.error(errors.email);
        }
        if (!password.trim()) {
            errors.password = 'Password is required.';
            toast.error(errors.password);
        } else if (password.length < 6) {
            errors.password = 'Password is too short.';
            toast.error(errors.password);
        }
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validate();
        if (isValid) {
            try {
                const data = await signIn(AuthenticationProvider.HOTEL, {
                    email: formInputs.email,
                    password: formInputs.password,
                    redirect: false,
                    // callbackUrl: '/hotels/overview'
                })
                if (data?.error) {
                    toast.error(data?.error);
                    return;
                } else {
                    toast.success("Logged in");
                    router.push(HOTEL_DASHBOARD);
                }
            } catch (error: any) {
                const errorData = error?.message ?? "Something went wrong while checking your credentials. Please try again later."
                toast.error(errorData);
                return errorData;
            }
        } else {
            toast.error('Form has errors. Please correct them');
        }
    }
    return (
        <form className="flex flex-col sm:gap-6 gap-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white/60 dark:text-white/60 tracking-wider">Email</label>
                <div className="bg-theme-black border border-theme-gray text-white/60 rounded-theme-lg relative flex items-center gap-2 py-2.5 px-4.5"  >
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.94" fill-rule="evenodd" clipRule="evenodd" d="M0.826172 0.521748C6.09715 0.512166 11.368 0.53365 16.6387 0.586201C16.6602 0.607685 16.6816 0.62917 16.7031 0.650654C16.8328 4.71773 16.9402 8.78541 17.0254 12.8538C17.3395 12.7986 17.6044 12.8845 17.8203 13.1116C17.8849 13.2637 17.8992 13.4212 17.8633 13.5842C17.8066 13.6696 17.7278 13.7198 17.627 13.7346C11.9983 13.8248 6.36944 13.8821 0.740234 13.9065C0.391715 13.8228 0.205518 13.6008 0.181641 13.2405C0.383529 10.2221 0.447982 7.19995 0.375 4.17409C0.356137 3.43559 0.320331 2.69794 0.267578 1.9612C0.307096 1.41941 0.493293 0.939619 0.826172 0.521748ZM1.55664 1.03737C1.56675 1.01172 1.58823 0.997412 1.62109 0.994404C6.3966 1.03007 11.1733 1.05155 15.9512 1.05886C14.0188 2.91958 12.0995 4.79589 10.1934 6.68776C9.86856 7.00552 9.52481 7.29917 9.16211 7.56862C7.92005 6.68235 6.71693 5.74421 5.55273 4.75417C4.20042 3.53798 2.8684 2.29902 1.55664 1.03737ZM16.209 1.51003C16.3545 5.19726 16.4548 8.89258 16.5098 12.596C11.4108 12.6522 6.31182 12.7095 1.21289 12.7678C1.363 9.14313 1.37016 5.5194 1.23438 1.89675C3.18126 4.21672 5.39414 6.22907 7.87305 7.93386C8.21521 8.10504 8.57327 8.22682 8.94727 8.29909C9.17595 8.22119 9.39079 8.11377 9.5918 7.97683C10.557 7.22646 11.4236 6.37426 12.1914 5.42019C13.4999 4.07569 14.8391 2.77232 16.209 1.51003Z" fill="white" fill-opacity="0.6" />
                    </svg>
                    <input type="email" name="email" id="email"
                        className="bg-transparent outline-none dark:focus:ring-black dark:focus:border-white/80 w-full"
                        placeholder="name@company.com" required={true} value={formInputs.email} onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} />
                </div>
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/60 dark:text-white/60 tracking-wider">Password</label>
                <div className="bg-theme-black border border-theme-gray text-white/60 rounded-theme-lg relative flex items-center gap-2 py-2.5 px-4.5">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.928" fill-rule="evenodd" clipRule="evenodd" d="M9.47461 1.31028C12.2259 1.16371 13.9375 2.42412 14.6094 5.09153C14.8489 6.32508 14.899 7.564 14.7598 8.80833C15.6209 9.09643 16.1007 9.69082 16.1992 10.5915C16.3249 13.3408 16.3536 16.0908 16.2852 18.8415C16.1167 19.6592 15.6368 20.1963 14.8457 20.4529C13.6046 20.6062 12.3585 20.6706 11.1074 20.6462C9.94658 20.6451 8.78642 20.6164 7.62695 20.5603C6.72341 20.6192 5.82106 20.612 4.91992 20.5388C3.38043 20.2619 2.58551 19.3381 2.53516 17.7673C2.49669 17.3528 2.47521 16.9375 2.4707 16.5212C2.55044 14.6285 2.65787 12.7379 2.79297 10.8493C2.93566 9.87468 3.43696 9.15852 4.29688 8.70091C4.34552 7.42074 4.57467 6.17464 4.98438 4.96262C5.60519 3.21026 6.80114 2.05727 8.57227 1.50364C8.87825 1.43537 9.17903 1.37091 9.47461 1.31028ZM9.77539 1.73997C11.3929 1.66424 12.6319 2.30877 13.4922 3.67356C14.1299 4.83505 14.4092 6.08114 14.3301 7.41184C14.3232 7.85631 14.3089 8.30031 14.2871 8.74387C13.8145 8.74387 13.3418 8.74387 12.8691 8.74387C12.8857 7.95467 12.8642 7.16688 12.8047 6.38059C12.6766 5.38084 12.2111 4.58592 11.4082 3.99583C10.3014 3.4808 9.28452 3.62402 8.35742 4.42551C7.76162 5.00839 7.41074 5.71737 7.30469 6.55247C7.18859 7.23511 7.13844 7.92261 7.1543 8.61497C6.53843 8.61497 5.92251 8.61497 5.30664 8.61497C5.27179 6.99131 5.62272 5.45874 6.35938 4.01731C7.17277 2.76652 8.31145 2.00741 9.77539 1.73997ZM9.86133 4.18919C10.7425 4.08912 11.4085 4.41855 11.8594 5.17747C12.2705 5.95585 12.4495 6.78656 12.3965 7.66966C12.3924 8.02879 12.3709 8.38689 12.332 8.74387C10.7806 8.69571 9.22651 8.65274 7.66992 8.61497C7.59872 7.56627 7.74911 6.54933 8.12109 5.56419C8.51383 4.86362 9.09391 4.40528 9.86133 4.18919ZM5.39258 9.08762C8.44388 9.13214 11.4947 9.19659 14.5449 9.28098C15.4037 9.58237 15.7975 10.1911 15.7266 11.1072C15.8234 13.5413 15.852 15.9761 15.8125 18.4118C15.7972 19.224 15.4034 19.7468 14.6309 19.9802C12.687 20.1807 10.7391 20.2236 8.78711 20.1091C7.61209 20.0622 6.43762 20.0049 5.26367 19.9372C4.47206 19.7614 3.97791 19.2817 3.78125 18.4978C3.72279 15.8025 3.78008 13.1098 3.95313 10.4197C4.15903 9.67634 4.63886 9.23234 5.39258 9.08762ZM9.32422 16.9939C9.15114 17.0249 9.40895 17.1395 9.32422 16.9939V16.9939Z" fill="white" fill-opacity="0.6" />
                        <path opacity="0.874" fill-rule="evenodd" clipRule="evenodd" d="M16.3496 2.25586C16.5454 2.28913 16.6241 2.40371 16.5859 2.59961C16.2149 3.15538 15.8998 3.74262 15.6406 4.36133C15.4049 4.51374 15.2545 4.45642 15.1895 4.18945C15.4146 3.53865 15.7297 2.93709 16.1348 2.38477C16.2054 2.33336 16.277 2.29039 16.3496 2.25586Z" fill="white" fill-opacity="0.6" />
                        <path opacity="0.877" fill-rule="evenodd" clipRule="evenodd" d="M18.5839 3.67383C18.8992 3.69591 18.9851 3.8463 18.8417 4.125C18.1324 4.587 17.4306 5.05966 16.7362 5.54297C16.4218 5.69074 16.2714 5.59762 16.285 5.26367C17.0472 4.72287 17.8134 4.1929 18.5839 3.67383Z" fill="white" fill-opacity="0.6" />
                        <path opacity="0.893" fill-rule="evenodd" clipRule="evenodd" d="M16.9085 6.42383C17.727 6.49993 18.5434 6.59304 19.3577 6.70312C19.572 6.98246 19.5004 7.13286 19.1429 7.1543C18.3979 7.07708 17.6531 6.99832 16.9085 6.91797C16.6828 6.75353 16.6828 6.58883 16.9085 6.42383Z" fill="white" fill-opacity="0.6" />
                        <path opacity="0.9" fill-rule="evenodd" clipRule="evenodd" d="M9.56088 12.6544C10.6134 12.6473 11.1863 13.1629 11.2796 14.2012C11.2706 14.735 11.0557 15.1646 10.6351 15.4903C10.6104 16.065 10.5746 16.6379 10.5277 17.2091C10.3621 17.5428 10.09 17.7003 9.71127 17.6817C9.29443 17.7172 9.008 17.5453 8.8519 17.1661C8.84472 16.6499 8.82324 16.1342 8.78744 15.6192C8.08791 15.1464 7.85158 14.5019 8.07846 13.6856C8.38405 13.0709 8.87819 12.7272 9.56088 12.6544ZM9.47494 13.17C9.07254 13.2678 8.76463 13.497 8.55112 13.8575C8.40326 14.5357 8.64672 15.0227 9.28158 15.3184C9.29589 15.877 9.31024 16.4356 9.32455 16.9942C9.32501 17.012 9.53819 17.1971 9.71127 17.1661C9.85272 17.1865 9.96732 17.1435 10.055 17.0372C10.0693 16.4643 10.0837 15.8913 10.098 15.3184C10.2975 15.1331 10.4838 14.9326 10.6566 14.7169C10.7368 14.5465 10.7869 14.3674 10.807 14.1798C10.6808 13.4311 10.2368 13.0945 9.47494 13.17Z" fill="white" fill-opacity="0.6" />
                    </svg>
                    <input type="password" name="password" id="password" placeholder="Enter your password"
                        className="bg-transparent outline-none dark:focus:ring-black dark:focus:border-white/80 w-full"
                        required={true} value={formInputs.password} onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })} />
                </div>
                <div className="flex flex-col items-end mt-2">
                    <a href="#" className="text-base font-medium text-primary hover:underline dark:text-primary underline tracking-wider">Forgot
                        password?
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="remember" aria-describedby="remember" type="checkbox"
                            className="w-5 h-5 border border-theme-gray rounded bg-theme-black focus:ring-3 focus:ring-primary-300 dark:bg-theme-black dark:border-gray-600 dark:focus:ring-primary dark:ring-offset-gray-800"
                            required={false} />
                    </div>
                    <div className="ml-2 text-base">
                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                </div>
            </div>
            <button type="submit"
                className="w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-theme-lg text-sm sm:text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-primary/50">
                Sign in
            </button>
        </form>
    );
}
export default LoginInForm;
