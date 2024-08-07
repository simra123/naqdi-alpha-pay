"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CancelOutlined,
  CheckCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";
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
    <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
      <h4 className="text-black-100 text-h3.5 font-semibold">KYC Approval</h4>
      <p className="text-button text-black-100">Welcome back to Alphaspay</p>

      <LoadingApi loading={!user || isUserDetailsLoading}>
        {user?.userDetails.kyc_status == "pending" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-pending.png"
                className="max-w-full w-[450px]"
                alt="KYC PENDING"
              />
            </div>
            <p className="text-black-100 mt-8">
              Please wait patiently while we are verifying your documents. The
              process may take 1-3 days to complete. Once your documents have
              been approved, you will be notified and you will be able to move
              to next step.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "approved" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-approved.png"
                className="max-w-full w-[450px]"
                alt="KYC Approved"
              />
            </div>
            <p className="text-black-100 mt-8">
              Congratulations, Your documents have been verified. Please click
              the next button to set your fee schedule.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "rejected" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <img
                src="/kyc-rejected.png"
                className="max-w-full w-[450px]"
                alt="KYC Approved"
              />
            </div>
            <p className="text-black-100 mt-8">
              We have not been able to verify your documents. Please check the
              remarks and try again.
            </p>

            {user?.userDetails.reason && (
              <>
                <h2 className="medium_heading_light mt-6 !font-semibold">
                  Remarks
                </h2>

                <p className="font-semibold mt-2">{user?.userDetails.reason}</p>
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
