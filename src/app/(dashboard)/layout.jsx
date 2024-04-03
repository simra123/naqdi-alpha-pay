"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loaded } = useAuth();

  if (!loaded) {
    return "...Loading";
  }

  if (!isAuthenticated) router.push("/login");
  if (isAuthenticated) router.push("/main/trader-registration");

  return (
    <>
      Layout
      {children}
    </>
  );
};

export default DashboardLayout;
