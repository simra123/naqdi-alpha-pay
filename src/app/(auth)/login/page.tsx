"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Cookie from "js-cookie";
import OTPInput from "react-otp-input";

import { Info, Lock, Mail } from "@mui/icons-material";

import ErrorApiText from "@/components/common/ErrorApiText";
import IconField from "@/components/common/IconField";
import LoaderButton from "@/components/common/LoaderButton";

import { loginSchema, mfaSchema } from "@/models/login";

import { Role } from "@/constants/roles";
import { loginApi, verifyMFAForUserApi, verifyMFAForAdminApi } from "@/services/auth";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import useFormValidation from "@/hooks/useFormValidation";

import { setNotification } from "@/store/slices/modal.Slice";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [hasMFA, setHasMFA] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<any>(null);
  const [isLoginLoading, isLoginError, callLoginApi] = useApi();
  const [isVerificationLoading, isVerificationError, callVerificationApi] =
    useApi();

  const initialValues = {
    email: "",
    password: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, loginSchema);

  const {
    errors: otpErrors,
    handleChange: handleChangeOtp,
    handleSubmit: verificationSubmit,
    validateField: validateOtp,
    values: otpValues,
  } = useFormValidation({ otp: "" }, mfaSchema);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callLoginApi(
        loginApi({
          username: values?.email,
          password: values?.password,
        })
      ),
      successCallBack: async (response) => {

        if (response?.data?.user?.userDetails?.mfa) {
          setHasMFA(true);
          setUserResponse(response);
          return;
        }

        loginHandler(response);
      },
    });
  };

  const verifyHandler = async () => {


    const verify = userResponse?.data?.user?.role == Role.USER
      ? verifyMFAForUserApi
      : verifyMFAForAdminApi

    await callApiHook({
      apiCall: callVerificationApi(
        verify({ token: otpValues?.otp }, userResponse?.data?.token)
      ),
      successCallBack: async (response) => {
        loginHandler(userResponse);
      },
    });
  };

  const loginHandler = (response: {
    data: { token: string; user: { role: string; userDetails: any } };
  }) => {
    const { token, user } = response?.data;
    Cookie.set("user", JSON.stringify(user));
    Cookie.set("token", token);

    if (user?.role == Role.USER) {
      if (user?.userDetails && user?.userDetails?.fees) {
        router.push("/");
      } else {
        router.push("/onboarding");
      }
    }
    if (user?.role == Role.ADMIN) {
      router.push("/");
    }
    dispatch(
      setNotification({ status: "success", message: "Loggedin Successfully" })
    );
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };

  return (
    <section className="mt-[30px]">
      {!hasMFA ? (
        <>
          <h1 className="mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
            Welcome Back!
          </h1>
          <p className="mb-[6px] text-p120 text-center">
            Enter your credentials to access your account.
          </p>
          <form
            onSubmit={(event) => handleSubmit(event, onSubmit, onSubmitError)}
            className="mt-[31px]"
          >
            <IconField
              label="Email"
              wrapperClassName="mb-6"
              type="text"
              error={errors.email}
              value={values.email}
              onChange={handleChange}
              onBlur={validateField}
              name="email"
              placeholder="Enter your email or username"
              icon={Mail}
            />
            <IconField
              label="Password"
              type="password"
              error={errors.password}
              value={values.password}
              onChange={handleChange}
              info="Use 8 or more characters with a mix of letters, numbers,
          special & uppercase characters."
              onBlur={validateField}
              name="password"
              icon={Lock}
              placeholder="Enter your password"
            />
            <Link
              href={"/recover-password"}
              className="block mb-14 font-semibold text-input text-purple-500 text-end"
            >
              Forgot Password?
            </Link>

            <ErrorApiText error={isLoginError} />

            <LoaderButton
              content={"Login"}
              variant={"contained"}
              type="submit"
              loading={isLoginLoading}
            />
          </form>
          <p className="mt-6 text-button text-center">
            New here?{" "}
            <Link href="/register" className="font-medium text-purple-500">
              Sign Up
            </Link>{" "}
            for Free!
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-8 font-semibold text-blackGrey-100 text-h2">
            Confirm Your Identity
          </h1>
          <p className="mb-12 text-p120">
            Enter your Google Autheticator code to complete login.
          </p>

          <form
            onSubmit={(event) =>
              verificationSubmit(event, verifyHandler, onSubmitError)
            }
          >
            <div className="mt-2 w-fit">
              <div className="flex items-center gap-2">
                <label className="block mb-2 font-medium">Enter Code</label>

                <div className="group relative flex items-center">
                  <Info className="mb-1 text-[18px] text-blue-info" />

                  <div className="hidden group-hover:block -top-[112px] -left-[50px] absolute bg-dark-gray py-2 rounded-large w-96 text-white text-sm transition-opacity duration-200">
                    <div className="relative p-2">
                      <p className="w-full text-center">
                        Use your Google Autheticator code here
                      </p>
                      <div className="-bottom-[38px] left-[33px] absolute bg-dark-gray rounded-large w-[50px] h-[50px] polygon-clip"></div>
                    </div>
                  </div>
                </div>
              </div>
              <OTPInput
                numInputs={6}
                containerStyle={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "6px",
                  flexWrap: "wrap",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="bg-blackGrey-filled-input p-2 md:p-4 py-4 border border-light-gray rounded-large outline-none !w-14 max-w-full"
                  />
                )}
                onChange={(value) =>
                  handleChangeOtp({ target: { value, name: "otp" } })
                }
                value={otpValues?.otp}
              />
              {otpErrors?.otp && (
                <p className="mt-2 ml-2 text-red-error-dark text-subtitle">
                  {otpErrors?.otp}
                </p>
              )}

              <LoaderButton
                className="mt-12"
                content={"Submit"}
                variant={"contained"}
                type="submit"
                loading={isVerificationLoading}
              />
              <ErrorApiText error={isVerificationError} />
            </div>
          </form>
        </>
      )}
    </section>
  );
};

export default Login;
