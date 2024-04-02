"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useRedirect from "@/hooks/useRedirect";

const DashboardLayout = ({ children }) => {
  const loaded = useRedirect("/login");

  if (!loaded) {
    return <div>...Loading</div>;
  }

  return (
    <>
      Layout
      {children}
    </>
  );
};

export default DashboardLayout;
