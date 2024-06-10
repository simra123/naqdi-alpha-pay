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
    <>
      <h2 className="large_heading_bold">KYC Approval</h2>

      <p className="text-base font-semibold mt-2">Welcome back to Alphaspay</p>

      <LoadingApi loading={!user || isUserDetailsLoading}>
        {user?.userDetails.kyc_status == "pending" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <PauseCircleOutline className="text-9xl text-orange-500" />
              <span className="font-bold text-xl text-orange-500">Pending</span>
            </div>
            <p className="text-base font-semibold mt-6">
              Please wait patiently while we are verifying your documents. The
              process may take 1-3 days to complete.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "approved" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <CheckCircleOutline className="text-9xl text-green-500" />
              <span className="font-bold text-xl text-green-500">Verified</span>
            </div>
            <p className="text-base font-semibold mt-6">
              <span className="font-bold text-lg">Congratulations ,</span> Your
              documents have been verified. Please click the next button to set
              your fee schedule.
            </p>
          </div>
        )}

        {user?.userDetails.kyc_status == "rejected" && (
          <div className="status my-8">
            <div className="flex flex-col justify-center items-center gap-1">
              <CancelOutlined className="text-9xl text-red-500" />
              <span className="font-bold text-xl text-red-500">Rejected</span>
            </div>
            <p className="text-base font-semibold mt-6">
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

        {user?.userDetails.kyc_status !== "approved" && (
          <p className="note mt-6">
            Once your documents have been approved, you will be notified and you
            will be able to move to next step.
          </p>
        )}
        {user?.userDetails?.kyc_approved && (
          <div className="btn_wrapper text-right">
            <button className="header_step_btn active fl" onClick={onSubmit}>
              Next
            </button>
          </div>
        )}
      </LoadingApi>
      <ErrorApiText error={isUserDetailsError} />
    </>
  );
};

export default KYCApproval;
