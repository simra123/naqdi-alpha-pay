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
import LoaderButton from "@/components/common/LoaderButton";

const FeeSchedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const router = useRouter();
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
    <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
      <h4 className="text-black-100 text-h3.5 font-semibold">
        Your Fee Schdeule
      </h4>
      <p className="text-button text-black-100">
        You will be paying the following fee for alphaspay.
      </p>

      <div>
        <div className=" mt-10 mb-2">
          <h4 className="text-p120 font-semibold text-black-100">Schedule</h4>
        </div>

        <div className="flex gap-3">
          <LoadingApi loading={isUserDetailsLoading}>
            {user?.userDetails?.fees ? (
              <FeeCard
                schedule={{ id: 1, value: user?.userDetails?.fees }}
                // selected={selectedSchedule}
              />
            ) : (
              <p className="text-black-100">
                We are setting your fees currently, Once done you will be able
                to move forward. Thanks for your patience
              </p>
            )}
            <ErrorApiText error={isUserDetailsError} />
          </LoadingApi>
        </div>
      </div>

      <p className="text-black-100  mt-5">
        Your Fee Schedule is mentioned above. For any querires you can contact
        us.
      </p>

      {user?.userDetails?.fees && (
        <div className="mt-8 max-w-[360px]">
          <LoaderButton
            content={"Go to Dashboard"}
            onClick={() => router.push("/")}
            variant={"contained"}
          />
        </div>
      )}
    </div>
  );
};

export default FeeSchedule;

export const FeeCard = ({ schedule }) => {
  return (
    <div
      className={`p-5 gap-6 shadow-md border w-[360px] max-w-full rounded-large border-purple-100 cursor-pointer transition-all text-purple-100`}
    >
      <div className="text-center">
        <span className="font-semibold text-h4">{schedule?.value} %</span>

        <p className=" mt-[2px]">Per Month*</p>
      </div>
    </div>
  );
};
