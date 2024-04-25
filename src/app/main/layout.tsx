"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import "./auth.scss";
import { Typography } from "@mui/material";
import useAuth from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { validateSteps } from "@/store/slices/onboarding.slice";

const Authlayout = ({ children }) => {
  const dispatch = useDispatch();
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
    return "...Loading";
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
      <footer>
        {/* <Image src={"/logo.png"} height={100} width={150} /> */}
        <svg
          width="110"
          height="85"
          viewBox="0 0 76 59"
          fill="none"
          className="mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M35 0H41V20H35V0Z" className="secondary-color"></path>
          <path d="M35 26H41V46H35V26Z" className="secondary-color"></path>
          <path d="M12 26H18V46H12V26Z" className="primary-color"></path>
          <path d="M58 26H64V46H58V26Z" className="primary-color"></path>
          <path d="M23 13H29V33H23V13Z" className="secondary-color"></path>
          <path d="M47 13H53V33H47V13Z" className="secondary-color"></path>
        </svg>
        <Typography>Copyright 2024. All Rights Reserved Alphaspay.</Typography>
      </footer>
    </main>
  );
};

export default Authlayout;
