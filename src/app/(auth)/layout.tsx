"use client";

import React, { useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Authlayout = ({ children }) => {
  const { isAuthenticated, loaded, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!loaded) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (pathname.includes("email-verification-required")) {
      logOut();
    } else {
      return router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex w-full shadow-lg">
        {/* Left Side (Form) */}
        <div className="w-full lg:w-1/2 py-20 px-6 bg-bluish-gray">
          <section className="content max-w-[500px] m-auto">
            <div className="logo-wrapper">
              <h4 className="text-h4 text-purple-500 font-bold">Alphaspay</h4>
            </div>
            {children}
          </section>
        </div>

        {/* Right Side (Image) */}

        <div className="fixed-background-wrapper w-1/2 hidden lg:block">
          <div className="fixed bg-auth-bg-purple h-screen w-1/2 flex items-center justify-center">
            <img
              src={"/auth-bg-person.png"}
              alt="Crypto Image"
              className="relative z-10 max-h-[674px] max-w-[85%]"
              draggable={false}
            />
            <img
              src="/auth-bg-footer.png"
              alt="background footer"
              className="absolute z-0 bottom-0 left-0 w-full"
              draggable={false}
            />
          </div>
          {/* Add any overlay text or icons here */}
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
