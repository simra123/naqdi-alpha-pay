"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { verifyApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";

const page = ({ params }) => {
  const router = useRouter();
  const [rendered, setRendered] = useState(false);
  const userId = params.userId;
  const [isVerificationLoading, isVerificationError, callVerificationApi] =
    useApi();

  const handleVerify = async () => {
    await callApiHook({
      apiCall: callVerificationApi(
        verifyApi({
          userId: +userId,
        })
      ),
      successCallBack: () =>
        setTimeout(() => {
          router.push("/login");
        }, 3000),
    });
  };
  useEffect(() => {
    setRendered(true);
    handleVerify();
  }, []);

  return (
    <div className="mx-auto max-w-screen-md">
      <Typography variant="h2" color="primary" className="text-center">
        Email Verification
      </Typography>

      <div className="flex flex-col gap-5 mt-12 max-w-xl">
        {<ErrorApiText error={isVerificationError} />}

        {(isVerificationLoading || !rendered) && (
          <p className="mx-1">Please wait we are verifying your email.</p>
        )}

        <LoadingApi loading={isVerificationLoading || !rendered}>
          {!isVerificationError && (
            <p className="color-primary">
              Congratulations, Your Email has been verified. Redirecting you to
              login shortly
            </p>
          )}
        </LoadingApi>
      </div>
      {isVerificationError && (
        <div className="text-center mt-14 pb-10">
          <button
            className="btn secondary-btn max-w-fit px-6 py-1"
            onClick={() => router.push("/main")}
          >
            resend verification email
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
