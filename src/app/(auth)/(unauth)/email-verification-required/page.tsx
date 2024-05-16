"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { resendEmailApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";

const page = () => {
  const email = decodeURIComponent(useSearchParams().get("email") || "");
  const [isResendLoading, isResendError, callResendApi] = useApi();

  const handleResendEmail = async () => {
    await callApiHook({
      apiCall: callResendApi(resendEmailApi({ email: email })),
      successCallBack: () => {
        console.log("Email Send");
      },
    });
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <Typography variant="h2" color="primary" className="text-center">
        Email Verification Required
      </Typography>

      <div className="flex flex-col gap-5 mt-12 max-w-xl">
        <p className="color-primary">
          A verification email was sent to
          <span className="font-bold"> {email}</span>
        </p>
        <p className="color-primary">
          Please click on the link to
          <span className="font-bold"> verify you Alphaspay account.</span>
        </p>
        <p className="color-primary">
          If you have not recieved the email, please check your `Spam` Folder,
          mark the email as `Not Spam` and click on the verification link.
        </p>
        <p className="color-primary">
          If you still have not recieved the email or your link has expired,
          please click on the button below to get a new verification link
        </p>
      </div>
      <div className="text-center mt-14 pb-10">
        <ErrorApiText error={isResendError} />
        <LoadingApi loading={isResendLoading}>
          <button
            className="btn secondary-btn max-w-fit px-6 py-1"
            onClick={handleResendEmail}
          >
            resend verification email
          </button>
        </LoadingApi>
      </div>
    </div>
  );
};

export default page;
