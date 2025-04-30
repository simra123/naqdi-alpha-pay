"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MdLock } from "react-icons/md";

import useFormValidation from "@/hooks/useFormValidation";
import { useApi } from "@/hooks/useApi";

import ErrorApiText from "@/components/common/ErrorApiText";
import IconField from "@/components/common/IconField";
import LoaderButton from "@/components/common/LoaderButton";

import { setupPasswordApi } from "@/services/auth";
import { setupPassword } from "@/models/setupPassword";

import { callApiHook } from "@/utils/apifuncs";

const SetupPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSetupPasswordLoading, isSetupPasswordError, callSetupPasswordApi] =
    useApi({
      notify: true,
    });

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, setupPassword);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callSetupPasswordApi(
        setupPasswordApi({
          token,
          newPassword: values?.password,
        })
      ),
      successCallBack: () => {
        router.push("/login");
      },
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };

  console.log({ errors });

  return (
    <>
      <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
        Setup Your Password
      </h2>

      <p className="text-blackGrey-100 text-p120 text-center">
        Enter the password you want to use with your Alphaspay account.
      </p>

      <form
        id="login-form"
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
        className="mt-[30px]"
      >
        <IconField
          type="password"
          onBlur={validateField}
          name="password"
          onChange={handleChange}
          value={values.password}
          error={errors.password}
          icon={MdLock}
          label="Password"
          placeholder="Enter Your Password"
        />
        <IconField
          type="password"
          onBlur={validateField}
          name="confirmPassword"
          onChange={handleChange}
          value={values.confirmPassword}
          error={errors?.confirmPassword}
          icon={MdLock}
          label="Confirm Password"
          placeholder="Enter Your Password"
        />

        <ErrorApiText error={isSetupPasswordError} />
        <div className="mt-8">
          <LoaderButton
            content={"Submit"}
            loading={isSetupPasswordLoading}
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

export default SetupPassword;
