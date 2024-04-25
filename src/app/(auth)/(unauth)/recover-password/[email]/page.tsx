"use client";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";
import useFormValidation from "@/hooks/useFormValidation";
import { useApi } from "@/hooks/useApi";
import { updatePasswordApi } from "@/services/auth";
import { callApiHook } from "@/utils/apifuncs";
import ErrorApiText from "@/components/common/ErrorApiText";
import { recoverSchema } from "@/models/recoverPassword";
import LoadingApi from "@/components/common/LoadindApi";

import "../../../auth.scss";

const UpdatePassword = ({ params }) => {
  const router = useRouter();
  const [isRecoverLoading, isRecoverError, callRecoverApi] = useApi();
  const email = decodeURIComponent(params?.email);
  console.log(email);

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

  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };

  return (
    <section>
      <Typography variant="h2" color="primary">
        Reset Password
      </Typography>
      <form
        id="login-form"
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
      >
        <div>
          <PasswordToggleInput
            value={values.password}
            onChange={handleChange}
            onBlur={validateField}
            name="password"
            placeholder={"Password*"}
          />
          {errors.password && (
            <div className="error_text">{errors.password}</div>
          )}
        </div>

        <div>
          <PasswordToggleInput
            value={values.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            placeholder={"Confirm Password*"}
            key={13}
          />
          {values.confirmPassword != values.password && (
            <div className="error_text">{errors.confirmPassword}</div>
          )}
        </div>

        <ErrorApiText error={isRecoverError} />

        <LoadingApi loading={isRecoverLoading}>
          <button className="btn gradient-btn" type="submit">
            Update Password
          </button>
        </LoadingApi>
      </form>
    </section>
  );
};

export default UpdatePassword;
