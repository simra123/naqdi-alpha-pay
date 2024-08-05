"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import useAuth from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { validateSteps } from "@/store/slices/onboarding.slice";
import useLocalStorage from "@/hooks/useLocalStorage";
import Loader from "@/components/common/Loader";
import LoadingScreen from "@/components/common/LoadingScreen";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useLocalStorage("user");
  const modal = useSelector((state: any) => state.modal.upgradeTrader);
  const router = useRouter();
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi();

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response) => {
        dispatch(setUser(response));
        dispatch(validateSteps(response));
      },
    });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const { isAuthenticated, loaded } = useAuth();

  if (!loaded || isUserDetailsLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return router.push("/login");
  }

  return (
    <main
      id="auth_layout"
      className={modal ? "overflow-hidden max-h-screen root" : "root"}
    >
      {children}
    </main>
  );
};

export default MainLayout;
