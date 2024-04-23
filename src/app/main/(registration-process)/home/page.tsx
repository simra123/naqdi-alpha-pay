"use client";

import { useDispatch } from "react-redux";

import React, { useEffect } from "react";
import { setModal } from "@/store/slices/modal.Slice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setModal(true));
  }, []);

  return (
    <>
      <div className="primary_section pt-10 pb-20 text-center">
        <h2 className="large_heading_bold">Welcome Muhammad Ahmed</h2>
        <p className="font-semibold">
          Last Login Date: Mar. 22, 2024 1:25 PM GMT+5
        </p>
      </div>
    </>
  );
};

export default Home;
