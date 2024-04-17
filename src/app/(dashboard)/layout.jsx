"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useCurrentTime from "@/hooks/useCurrentTime";
import Sidebar from "@/components/common/Sidebar";
import { getUrlBreadCrumb } from "@/utils/getUrlBreadCrumb";
import { IconButton } from "@mui/material";
import { Logout } from "@mui/icons-material";

const DashboardLayout = ({ children }) => {
  const { date, time } = useCurrentTime();
  const { isAuthenticated, loaded } = useAuth();
  const router = useRouter();

  if (!loaded) {
    return "...Loading";
  }

  if (!isAuthenticated) return router.push("/login");

  return (
    <>
      <div className="grid grid-cols-3 py-1 px-6 items-center">
        <div className="time">
          <p className="text-sm primary-color font-bold">
            {date} {" / "}
            {time}
          </p>
        </div>
        <div className="center-heading">
          <p className="text-sm text-center primary-color font-bold">
            Alphaspay
          </p>
        </div>
        <div className="text-end">
          <IconButton
            onClick={() => {
              window?.localStorage?.removeItem("token");
              router.push("/login");
            }}
          >
            <Logout />
          </IconButton>
        </div>
      </div>
      <div className="flex gap-4 mt-5 mb-3">
        <div className="clearfix w-64"></div>
        <div className="w-full">
          <p className="font-bold">{getUrlBreadCrumb(usePathname())}</p>
        </div>
      </div>

      <div className="flex layout-wrapper">
        <div className="sidebar w-64 h-full">
          <Sidebar />
        </div>
        <div className="children h-full w-full me-2 px-3 py-2 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
