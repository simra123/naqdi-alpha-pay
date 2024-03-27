"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);
  return <div>Home</div>;
};

export default Home;
