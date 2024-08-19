"use client";
import React from "react";

import useRedirect from "@/hooks/useRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";

const Main = () => {
  const loaded = useRedirect("/main/trader-registration");

  if (!loaded) {
    return <LoadingScreen />;
  }
  return <LoadingScreen />;
};

export default Main;
