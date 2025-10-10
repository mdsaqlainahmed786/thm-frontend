import LoginInForm from "@/components/Hotel/Login";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hotel Login | The Hotel Media",
};
export default function Login() {
  return (
    <div className="relative md:h-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/login-hero.jpeg')",
        backgroundSize: "cover",
        backgroundColor: "#00000065",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute  w-screen md:h-full h-screen backdrop-blur-[8px] bg-[#00000065]">
      </div>
      <div className="flex flex-col items-center justify-center sm:px-6 px-3 py-8 mx-auto md:h-screen lg:py-0 relative z-10">
        <div
          className="w-full bg-theme-black/80 rounded-theme-lg shadow md:mt-0 sm:min-w-[460px] max-h-[540px] xl:p-0 dark:bg-theme-black/80 backdrop-blur-[28px] pb-10">
          <div className="xsm:p-6 p-4 sm:p-10 sm:gap-8 xsm:gap-6 gap-4 flex flex-col">
            <h1 className="text-xl font-normal leading-tight tracking-tight text-white md:text-3xl dark:text-white/60 text-center">
              Sign In
            </h1>
            <LoginInForm />
          </div>
        </div>
      </div>
    </div >
  );
}
