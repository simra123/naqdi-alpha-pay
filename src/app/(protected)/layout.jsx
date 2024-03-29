"use client";

import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const DashboardLayout = ({ children }) => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/login");
    
  }, []);

  return (
    <>
      Layout
      {children}
    </>
  );
};

export default DashboardLayout;
