"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { resendEmailApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import useFormValidation from "@/hooks/useFormValidation";
import { ForgotSchema } from "@/models/forgot";
import LoaderButton from "@/components/common/LoaderButton";
import IconField from "@/components/common/IconField";
import { Mail } from "@mui/icons-material";

const page = () => {
  const router = useRouter();
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

      },
    });
  };

  const onSubmit = async () => {
    handleResendEmail();
  };

  const onSubmitError = () => {

  };

  return (
    <div className="mx-auto max-w-screen-md">
      {email ? (
        <>
          <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
            Email Verification !
          </h2>

          <p className="text-blackGrey-100 text-p120 text-center">
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

            <div className="mx-auto mt-4 w-[310px]">
              <LoaderButton
                content={"Go Back"}
                variant="text"
                onClick={() => router.push("/login")}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
            Resend Verification Email !
          </h2>

          <p className="text-blackGrey-100 text-p120 text-center">
            Enter the email address registered with your Alphaspay account and
            we will send you verification email again.
          </p>

          <form
            id="login-form"
            onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
            className="mt-[30px]"
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

          <p className="mt-6 text-blackGrey-100">
            NOTE: It is extremely important to ensure that email registered for
            your account is valid and up-to-date. If you lose your password or
            otherwise lose access to your account, the only way to regain access
            is by resetting the password, which requires access to the email
            address registered. If you do not have access to the email address,
            you may not be able to recover your account. In this case, please
            contact us at{" "}
            <a
              href={`mailto:info@alphaspay.com`}
              className="text-purple-500 underline"
            >
              info@alphaspay.com
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default page;
