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
    <div className="flex bg-[url('/auth-page-logo.png')] bg-no-repeat bg-left-bottom sm:px-8 min-h-screen">
      <div className="flex bg-white sm:bg-transparent bg-opacity-95 sm:bg-opacity-100 sm:m-auto py-5 w-full max-w-[1650px] sm:h-[874px] max-h-screen">
        {/* Left Side (Form) */}
        <div className="sm:bg-white sm:bg-opacity-95 px-6 py-[75px] border-purple sm:border-t sm:border-r lg:border-r-0 sm:border-b sm:border-l sm:rounded-r-[50px] lg:rounded-r-[0px] sm:rounded-l-[50px] w-full lg:w-1/2 overflow-auto short-scrollbar">
          <section className="m-auto max-w-[500px] content">
            <img
              src="/logo-new.png"
              alt="Alphaspay Logo"
              className="block mx-auto w-[200px]"
            />

            {children}
          </section>
        </div>

        {/* Right Side (Image) */}

        <div className="hidden lg:flex lg:justify-center lg:items-center bg-[#310F4E] px-12 rounded-r-[50px] w-1/2">
          <img src="/auth-bg.png" alt="Crypto Mobile device" className="max-h-[90%]" />
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
