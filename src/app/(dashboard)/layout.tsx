"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/common/Sidebar";

import Cookies from "js-cookie";

import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingScreen from "@/components/common/LoadingScreen";
import Header from "@/components/common/Header";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { validateSteps } from "@/store/slices/onboarding.slice";
import { useDispatch } from "react-redux";
import { Role } from "@/constants/roles";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useDispatch();

  const { isAuthenticated, loaded } = useAuth();

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi();

  const getUserDetails = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callUserDetailsApi(userDetailsApi()),
        successCallBack: (response) => {
          // updatedOnboardingCookies(response?.userDetails);
          Cookies.set("user", JSON.stringify(response));
          dispatch(setUser(response));
          dispatch(validateSteps(response));
        },
      });
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!loaded || isUserDetailsLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return router.push("/login");
  }

  return (
    <>
      <div className="md:flex min-h-screen">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 md:px-0 w-full h-[inherit] overflow-hidden children">
          <div>
            <Header navHandler={toggleSidebar} />
          </div>
          <div className="p-2 xxs:p-6 md:p-8 md:max-h-[calc(100vh-95px)] md:overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
