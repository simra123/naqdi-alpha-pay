"use client";
import { useRouter } from "next/navigation";
import useFormValidation from "@/hooks/useFormValidation";
import { useApi } from "@/hooks/useApi";
import { updatePasswordApi } from "@/services/auth";
import { callApiHook } from "@/utils/apifuncs";
import ErrorApiText from "@/components/common/ErrorApiText";
import { recoverSchema } from "@/models/recoverPassword";
import IconField from "@/components/common/IconField";
import LoaderButton from "@/components/common/LoaderButton";
import { Lock } from "@mui/icons-material";
import { useState } from "react";

const UpdatePassword = ({ params }) => {
  const router = useRouter();
  const [confirmPassError, setConfirmPassError] = useState<string | boolean>(
    false
  );
  const [isRecoverLoading, isRecoverError, callRecoverApi] = useApi({
    notify: true,
  });
  const email = decodeURIComponent(params?.email);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, recoverSchema);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callRecoverApi(
        updatePasswordApi({
          email: email,
          password: values?.password,
          confirm_password: values?.confirmPassword,
        })
      ),
      successCallBack: () => router.push("/login"),
    });
  };

  const validateMatchPass = (e) => {
    const { value } = e.target;

    if (value == values?.password) {
      setConfirmPassError(false);
    } else {
      setConfirmPassError("Passwords Must Match.");
    }
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };

  return (
    <>
      <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
        Reset Your Password
      </h2>

      <p className="text-blackGrey-100 text-p120 text-center">
        Enter the new password you want to use with your {email} Alphaspay
        account.
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
          icon={Lock}
          label="Password"
          placeholder="Enter Your Password"
        />
        <IconField
          type="password"
          onBlur={validateMatchPass}
          name="confirmPassword"
          onChange={handleChange}
          value={values.confirmPassword}
          error={confirmPassError}
          icon={Lock}
          label="Confirm Password"
          placeholder="Enter Your Password"
        />

        <ErrorApiText error={isRecoverError} />
        <div className="mt-8">
          <LoaderButton
            content={"Reset"}
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

export default UpdatePassword;
