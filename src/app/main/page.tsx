"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import useRedirect from "@/hooks/useRedirect";

const Main = () => {
  const loaded = useRedirect("/main/trader-registration");

  if (!loaded) {
    return "...Loading";
  }
  return (
    <section className="main_page">
      <div className="large_container">
        <div className="text-center">
          <Image
            src={"/logo.png"}
            height={100}
            width={150}
            alt="logo"
            className="mx-auto mt-8"
            priority
          />
          <Typography variant="h5" color="primary">
            Alphaspay
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default Main;
