"use client";

import { useDispatch } from "react-redux";

import React, { useEffect, useState } from "react";
import { setModal } from "@/store/slices/modal.Slice";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { capitalize } from "@/utils/dataFormatters";

const Home = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        setUser(response?.userDetails);
        if (!response?.userDetails?.fees) {
          dispatch(setModal(true));
        }
      },
    });
  };

  return (
    <>
      <div className="primary_section pt-10 pb-20 text-center">
        <LoadingApi loading={isUserDetailsLoading}>
          <h2 className="large_heading_bold">
            {capitalize(user?.user?.first_name)}{" "}
            {capitalize(user?.user?.last_name)}
          </h2>
          <p className="font-semibold">
            Last Login Date: Mar. 22, 2024 1:25 PM GMT+5
          </p>
        </LoadingApi>
        <ErrorApiText error={isUserDetailsError} />
      </div>
    </>
  );
};

export default Home;
