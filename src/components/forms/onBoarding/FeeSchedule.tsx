"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { Check, CheckCircle, Forward } from "@mui/icons-material";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import LoadingApi from "@/components/common/LoadindApi";
import { useRouter } from "next/navigation";

const FeeSchedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);
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
        setUser(response);
      },
    });
  };

  // const handleScheduleSelect = (id) => () => {
  //   setSelectedSchedule(id);
  // };

  // const handleSubmit = () => {
  //   if (!selectedSchedule) {
  //     return setError("Please Select a Schedule");
  //   }

  //   setError(null);
  //   // submit logic
  // };

  return (
    <>
      <h2 className="large_heading_bold">Your Fee Schdeule</h2>
      <p>You will be paying the following fee for alphaspay. </p>

      <div>
        <div className="register_form__trader__heading mt-10">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Schedule
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LoadingApi loading={isUserDetailsLoading}>
            {user?.userDetails?.fees ? (
              <FeeCard
                schedule={{ id: 1, value: user?.userDetails?.fees }}
                // selected={selectedSchedule}
              />
            ) : (
              <p>
                We are setting your fees currently, Once done you will be able
                to move forward. Thanks for your patience
              </p>
            )}
            <ErrorApiText error={isUserDetailsError} />
          </LoadingApi>
        </div>
      </div>
      <div className="mt-2">
        <ErrorApiText error={error} />
      </div>

      <p className="note mt-14">
        Your Fee Schedule is mentioned above. For any querires you can contact
        us.
      </p>
      {user?.userDetails?.fees && (
        <div className="btn_wrapper text-right">
          <button
            className="header_step_btn active fl"
            onClick={() => router.push("/")}
          >
            <span>Go to Dashboard </span> <Forward />
          </button>
        </div>
      )}
    </>
  );
};

export default FeeSchedule;

export const FeeCard = ({ schedule }) => {
  return (
    <div
      className={`card p-5 gap-6 shadow-md border cursor-pointer transition-all relative`}
    >
      <div className="text-center p-6">
        <span className="font-bold text-4xl">
          {schedule?.value} <span className="text-3xl">%</span>
        </span>

        <p className=" mt-[1px] !text-[12px] font-semibold">Per Month*</p>
      </div>
    </div>
  );
};
