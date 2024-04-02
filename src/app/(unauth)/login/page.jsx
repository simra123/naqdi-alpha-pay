"use client";
import { Typography, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";
import Link from "next/link";
import "../auth.scss";
import useFormValidation from "@/hooks/useFormValidation";
import { loginSchema } from "@/models/login";
import { useApi } from "@/hooks/useApi";
import { loginApi } from "@/services/auth";
import { callApiHook } from "@/utils/apifuncs";
import Loader from "@/components/common/Loader";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";

const Login = () => {
  const router = useRouter();
  const [isLoginLoading, isLoginError, callLoginApi] = useApi();

  const initialValues = {
    email: "",
    password: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, loginSchema);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callLoginApi(
        loginApi({
          username: values?.email,
          password: values?.password,
        })
      ),
      successCallBack: () => router.push("/main"),
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };

  return (
    <section>
      <Typography variant="h2" color="primary">
        Autheticate
      </Typography>
      <form
        id="login-form"
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
      >
        <div>
          <TextField
            label={null}
            className="input-field"
            placeholder="Email* or Username*"
            type="text"
            fullWidth
            value={values.email}
            onChange={handleChange}
            onBlur={validateField}
            name="email"
            inputProps={{
              autoComplete: "new-password",
              form: {
                autoComplete: "off",
              },
            }}
          />
          {errors.email && <div className="error_text">{errors.email}</div>}
        </div>

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

        <Typography
          component={Link}
          href={"/recover-password"}
          variant="body1"
          color="primary"
          className="Link"
        >
          Forgot Password?
        </Typography>

        <ErrorApiText error={isLoginError} />

        <LoadingApi loading={isLoginLoading}>
          <button
            variant="contained"
            color="primary"
            className="btn gradient-btn"
            type="submit"
          >
            Login
          </button>
        </LoadingApi>

        <div className="register">
          <Typography variant="body1" color="primary">
            Don't have an account?
          </Typography>
          <Link className="btn secondary-btn block" href={"/register"}>
            Register
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
