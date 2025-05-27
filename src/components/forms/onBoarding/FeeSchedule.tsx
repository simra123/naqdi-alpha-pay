"use client";

import React, { useEffect, useState } from "react";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import LoadingApi from "@/components/common/LoadindApi";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/common/LoaderButton";
import useLocalStorage from "@/hooks/useLocalStorage";
import { updatedOnboardingCookies } from "@/utils/cookies";

const FeeSchedule = () => {
  const router = useRouter();
  const [hasFee, setHasFee] = useState(null);
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] = useApi(
    { initailLoading: true }
  );

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        setHasFee(response?.company?.fee);
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 bg-white mt-8 p-8 rounded-small">
      <h4 className="font-semibold text-black-100 text-h3.5">
        Your Fee Schdeule
      </h4>

      {hasFee && (
        <p className="text-black-100 text-button">
          You will be paying the following fee for alphaspay.
        </p>
      )}

      <div>
        <div className="mt-10 mb-2">
          <h4 className="font-semibold text-black-100 text-p120">Schedule</h4>
        </div>

        <div className="flex gap-3">
          <LoadingApi loading={isUserDetailsLoading}>
            {hasFee ? (
              <FeeCard
                schedule={{ id: 1, value: hasFee }}
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

      {hasFee && (
        <p className="mt-5 text-black-100">
          Your Fee Schedule is mentioned above. For any querires you can contact
          us.
        </p>
      )}

      {hasFee && (
        <div className="mt-8 max-w-[360px]">
          <LoaderButton
            content={"Go to Dashboard"}
            onClick={() => router.replace("/")}
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
      className={`p-5 gap-6 shadow-md border w-[360px] max-w-full rounded-large border-purple-100 cursor-pointer transition-all text-purple-500`}
    >
      <div className="text-center">
        <span className="font-semibold text-h4">{schedule?.value} %</span>

        <p className="mt-[2px]">Per Transaction*</p>
      </div>
    </div>
  );
};
