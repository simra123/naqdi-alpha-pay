"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/common/Sidebar";

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
  const dispatch = useDispatch();

  const { isAuthenticated, loaded } = useAuth();

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi();

  const getUserDetails = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callUserDetailsApi(userDetailsApi()),
        successCallBack: (response) => {
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
    console.log("Unautheticated");
    return router.push("/login");
  }

  return (
    <>
      <div className="flex gap-8 min-h-screen bg-bluish-gray">
        <div className="sidebar w-64 py-5 pl-5 hidden md:block">
          <Sidebar />
        </div>
        <div className="children h-[inherit] w-full p-5 md:px-0 flex-1 overflow-y-hidden">
          <div className=" md:pr-5">
            <Header />
          </div>
          <div className="max-h-[calc(100vh-170px)] overflow-auto md:pr-5">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
