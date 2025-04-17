"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { STEPS } from "@/constants/onboarding";
import { setStep } from "@/store/slices/onboarding.slice";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";
import LoaderButton from "@/components/common/LoaderButton";

const KYCApproval = () => {
  const dispatch = useDispatch();
  const { isUserDetailsLoading, isUserDetailsError, getUserDetails } =
    useGetUserDetaiils();
  const user: any = useSelector((state: any) => state?.user?.data);

  useEffect(() => {
    getUserDetails();
  }, []);

  const onSubmit = () => {
    dispatch(
      setStep({
        previous_step: STEPS.KYCAPPROVAL,
        current_step: STEPS.FEESCHEDULE,
      })
    );
  };

  return (
    <div className="flex flex-col gap-5 bg-white mt-8 p-12 rounded-small">
      <h4 className="font-semibold text-black-100 text-h3.5">KYC Approval</h4>
      <p className="text-black-100 text-button">Welcome back to Alphaspay</p>

      <LoadingApi loading={!user || isUserDetailsLoading}>
        {user?.userDetails.kyc_status == "pending" && (
          <div className="my-8 status">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-pending.png"
                className="w-[450px] max-w-full"
                alt="KYC PENDING"
              />
            </div>
            <p className="mt-8 text-black-100">
              Please wait patiently while we are verifying your documents. The
              process may take 1-3 days to complete. Once your documents have
              been approved, you will be notified and you will be able to move
              to next step.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "approved" && (
          <div className="my-8 status">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-approved.png"
                className="w-[450px] max-w-full"
                alt="KYC Approved"
              />
            </div>
            <p className="mt-8 text-black-100">
              Congratulations, Your documents have been verified. Please click
              the next button to set your fee schedule.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "rejected" && (
          <div className="my-8 status">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-rejected.png"
                className="w-[450px] max-w-full"
                alt="KYC Approved"
              />
            </div>
            <p className="mt-8 text-black-100">
              We have not been able to verify your documents. Please check the
              remarks and try again.
            </p>

            {user?.userDetails.reason && (
              <>
                <h2 className="mt-6 !font-semibold medium_heading_light">
                  Remarks
                </h2>

                <p className="mt-2 font-semibold">{user?.userDetails.reason}</p>
              </>
            )}
          </div>
        )}

        {user?.userDetails?.kyc_approved && (
          <div className="mt-8 max-w-[360px]">
            <LoaderButton
              content={"Continue"}
              onClick={onSubmit}
              variant={"contained"}
            />
          </div>
        )}
      </LoadingApi>
      <ErrorApiText error={isUserDetailsError} />
    </div>
  );
};

export default KYCApproval;
