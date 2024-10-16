"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { verifyApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import Cookies from "js-cookie";

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
      successCallBack: () => {

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      },
    });
  };
  useEffect(() => {
    setRendered(true);
    handleVerify();
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center">
      <h2 className="text-h2 font-semibold mb-4 text-blackGrey-100 mt-14">
        Email Verification !
      </h2>

      <div className="flex flex-col gap-5 mt-12 max-w-xl">
        {<ErrorApiText error={isVerificationError} />}

        {(isVerificationLoading || !rendered) && (
          <p className="mx-1">Please wait we are verifying your email.</p>
        )}

        <LoadingApi loading={isVerificationLoading || !rendered}>
          {!isVerificationError && (
            <p className="text-green-chip">
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
            onClick={() => router.push("/email-verification-required")}
          >
            resend verification email
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
