"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [step, setStep] = useState(0); // 0: Initiate, 1: Verify & Update
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
  const [formInputs, setFormInputs] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInitiate = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.post("/admin/profile/update-password/initiate");
      if (response.data && response.data.status) {
        toast.success(response.data.message || "OTP sent to your email");
        setStep(1);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      handleClientApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formInputs.newPassword !== formInputs.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formInputs.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest.post("/admin/profile/update-password/verify", {
        otp: formInputs.otp,
        newPassword: formInputs.newPassword,
      });
      if (response.data && response.data.status) {
        toast.success(response.data.message || "Password updated successfully");
        onClose();
        setStep(0);
        setFormInputs({ otp: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      handleClientApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-full items-center justify-center bg-black/60 px-4 py-5 backdrop-blur-sm">
      <div className="relative w-full max-w-142.5 rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark sm:p-12.5">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z"
              fill=""
            ></path>
          </svg>
        </button>

        {step === 0 ? (
          <div className="text-center">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Update Password
            </h3>
            <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
              To update your password, we need to verify your email. An OTP will
              be sent to <strong>{email}</strong>.
            </p>
            <button
              onClick={handleInitiate}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-center text-xl font-bold text-black dark:text-white sm:text-2xl">
              Verify OTP
            </h3>
            <form onSubmit={handleVerifyAndUpdate}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-update-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const newOtp = [...otpValues];
                        newOtp[index] = val;
                        setOtpValues(newOtp);
                        setFormInputs({ ...formInputs, otp: newOtp.join("") });
                        if (val && index < 4) {
                          document.getElementById(`otp-update-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
                          document.getElementById(`otp-update-${index - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center rounded-lg border border-stroke bg-transparent text-xl font-bold text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  ))}
                </div>
              </div>
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
                    value={formInputs.newPassword}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, newPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
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
                    onChange={(e) =>
                      setFormInputs({
                        ...formInputs,
                        confirmPassword: e.target.value,
                      })
                    }
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
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                {loading ? "Verifying..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mt-4 w-full text-sm text-primary hover:underline"
              >
                Resend OTP?
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
