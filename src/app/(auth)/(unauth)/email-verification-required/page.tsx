"use client";

import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { resendEmailApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import useFormValidation from "@/hooks/useFormValidation";
import { ForgotSchema } from "@/models/Forgot";
import LoaderButton from "@/components/common/LoaderButton";
import IconField from "@/components/common/IconField";
import { Mail } from "@mui/icons-material";

const page = () => {
  const email = decodeURIComponent(useSearchParams().get("email") || "");
  const [isResendLoading, isResendError, callResendApi] = useApi();

  const initialValues = {
    email: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, ForgotSchema);

  const handleResendEmail = async () => {
    await callApiHook({
      apiCall: callResendApi(resendEmailApi({ email: email || values?.email })),
      successCallBack: () => {
        console.log("Email Send");
      },
    });
  };

  const onSubmit = async () => {
    handleResendEmail();
  };

  const onSubmitError = () => {
    console.log("ERORO ");
  };

  return (
    <div className="mx-auto max-w-screen-md">
      {email ? (
        <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <h2 className="text-h2 font-semibold mb-4 text-blackGrey-100 mt-20">
            Email Verification !
          </h2>

          <p className="text-p120 text-blackGrey-100 leading-7 mt-5">
            Your security is our priority. We sent an email to {email} to ensure
            a seamless and protected sign-up process, we require email
            verification. Please check your inbox, then follow the instructions
            to finish setting up your Alphaspay account.
          </p>

          <div className="mt-16 pb-10">
            <ErrorApiText error={isResendError} />
            <LoaderButton
              content={"Resend Email"}
              loading={isResendLoading}
              onClick={handleResendEmail}
              variant={"contained"}
            />

            <p className="text-p120 text-blackGrey-100 text-center mt-5">
              Go To Email
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <h2 className="text-h2 font-semibold mb-4 text-blackGrey-100 mt-20">
            Resend Verification Email !
          </h2>

          <p className="text-p120 text-blackGrey-100 leading-7 mt-2">
            Enter the email address registered with your Alphaspay account and
            we will send you verification email again.
          </p>

          <form
            id="login-form"
            onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
            className="mt-12"
          >
            <IconField
              type="email"
              onBlur={validateField}
              name="email"
              onChange={handleChange}
              value={values.email}
              error={errors.email}
              icon={Mail}
              label="Email"
              placeholder="Enter Your Email"
            />
            <ErrorApiText error={isResendError} />
            <div className="mt-8">
              <LoaderButton
                content={"Send Instructions"}
                loading={isResendLoading}
                type="submit"
                variant={"contained"}
              />
            </div>
          </form>

          <p className="text-blackGrey-100 mt-6">
            NOTE: It is extremely important to ensure that email registered for
            your account is valid and up-to-date. If you lose your password or
            otherwise lose access to your account, the only way to regain access
            is by resetting the password, which requires access to the email
            address registered. If you do not have access to the email address,
            you may not be able to recover your account. In this case, please
            contact us at{" "}
            <a
              href={`mailto:info@alphaspay.com`}
              className="text-purple-100 underline"
            >
              info@alphaspay.com
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
