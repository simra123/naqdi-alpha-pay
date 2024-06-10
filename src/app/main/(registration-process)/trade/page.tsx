"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Bars, Bitcoin, Dollar } from "@/assets/Svgs";

import "./trade.scss";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import ComingSoon from "@/components/ui/ComingSoon";

const Trade = () => {
  const [Component, setComponent] = useState(null);
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        if (response?.userDetails?.fees) {
          setComponent(<ComingSoon />);
        } else {
          setComponent(<TradeOptions />);
        }
      },
    });
  };

  return (
    <div className="container-custom mx-auto mt-24">
      <ErrorApiText error={isUserDetailsError} />
      <LoadingApi loading={isUserDetailsLoading}>{Component}</LoadingApi>
    </div>
  );
};

export default Trade;

const TradeOptions = () => {
  return (
    <>
      <div className="text-center max-w-80 mx-auto">
        <h2 className="large_heading_bold mb-16">Select a Market</h2>
        <TextField
          type="text"
          className="input-field "
          fullWidth
          placeholder="Search a fiat or crypto"
        />
        <div className="flex gap-3 mt-1 justify-center">
          <button className="capsule_btn border rounded-full py-1 px-4">
            Digital
          </button>
          <button className="capsule_btn border  rounded-full py-1 px-4">
            Fiat
          </button>
          <button className="capsule_btn border  rounded-full py-1 px-4 active">
            All
          </button>
        </div>
      </div>

      <div className="currncies_list_wrapper">
        <div className="currency_section mt-10">
          <h3 className="font-semibold text-base">U.S. DOLLAR (USD)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
          </div>
        </div>
        <div className="currency_section mt-10">
          <h3 className="font-semibold text-base">EMIRATI DIRHAM (AED)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
            <div className="currency_item">
              <div className="flex items-center gap-6">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC / USD</span>
              </div>
              <div className="bars">
                <Bars className="bar_svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
