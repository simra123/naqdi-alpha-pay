"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { verifyApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";

const page = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
      successCallBack: (response) => {
        console.log({ response });
        dispatch(
          setNotification({
            message: !response?.setPassword
              ? response?.message
              : "Password has already been setup",
            status: "success",
          })
        );
        if (response?.setPassword) {
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push(`/setup-password?token=${token}`);
          }, 1000);
        }
      },
    });
  };
  useEffect(() => {
    setRendered(true);
    handleVerify();
  }, []);

  return (
    <>
      <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
        Email Verification !
      </h2>

      <div className="flex flex-col gap-5 max-w-xl">
        {<ErrorApiText error={isVerificationError} />}

        {(isVerificationLoading || !rendered) && (
          <p className="mx-1 text-center">
            Please wait we are verifying your email.
          </p>
        )}

        <LoadingApi loading={isVerificationLoading || !rendered}>
          {!isVerificationError && (
            <p className="mt-8 text-green-chip text-center">
              Congratulations, Your Email has been verified. Redirecting you
              shortly.
            </p>
          )}
        </LoadingApi>
      </div>
      {isVerificationError && (
        <div className="mt-[30px] pb-10 text-center">
          <button
            className="px-6 py-1 max-w-fit btn secondary-btn"
            onClick={() => router.push("/email-verification-required")}
          >
            resend verification email
          </button>
        </div>
      )}
    </>
  );
};

export default page;
