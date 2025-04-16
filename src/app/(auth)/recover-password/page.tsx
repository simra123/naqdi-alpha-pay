"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ForgotSchema } from "@/models/forgot";
import useFormValidation from "@/hooks/useFormValidation";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { recoverPasswordApi } from "@/services/auth";
import IconField from "@/components/common/IconField";
import { Mail } from "@mui/icons-material";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoaderButton from "@/components/common/LoaderButton";

const ForgotPassword = () => {
  const router = useRouter();
  const [isRecoverLoading, isRecoverError, callRecoverApi] = useApi({
    notify: true,
  });
  const initialValues = {
    email: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, ForgotSchema);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callRecoverApi(
        recoverPasswordApi({
          email: values?.email,
        })
      ),
      successCallBack: () => {},
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };
  return (
    <>
      <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
        Recover Your Account
      </h2>

      <p className="text-blackGrey-100 text-p120 text-center">
        Enter the email address registered with your Alphaspay account and we
        will email you instructions on how to reset your password.
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
        <ErrorApiText error={isRecoverError} />
        <div className="mt-8">
          <LoaderButton
            content={"Send Instructions"}
            loading={isRecoverLoading}
            type="submit"
            variant={"contained"}
          />
        </div>
      </form>

      <p className="mt-6 text-blackGrey-100">
        NOTE: It is extremely important to ensure that email registered for your
        account is valid and up-to-date. If you lose your password or otherwise
        lose access to your account, the only way to regain access is by
        resetting the password, which requires access to the email address
        registered. If you do not have access to the email address, you may not
        be able to recover your account. In this case, please contact us at{" "}
        <a
          href={`mailto:info@alphaspay.com`}
          className="text-purple-500 underline"
        >
          info@alphaspay.com
        </a>
      </p>
    </>
  );
};

export default ForgotPassword;
