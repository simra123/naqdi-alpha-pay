"use client";
import { Typography, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";
import Link from "next/link";
import "../../auth.scss";
import useFormValidation from "@/hooks/useFormValidation";
import { loginSchema } from "@/models/login";
import { useApi } from "@/hooks/useApi";
import { loginApi } from "@/services/auth";
import { callApiHook } from "@/utils/apifuncs";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import { Role } from "@/constants/roles";
import IconField from "@/components/common/IconField";
import { Lock, Mail, Person } from "@mui/icons-material";
import Loader from "@/components/common/Loader";
import LoaderButton from "@/components/common/LoaderButton";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
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
      successCallBack: (response) => {
        const { token, user } = response?.data;
        window?.localStorage?.setItem("token", token);
        window?.localStorage?.setItem("user", JSON.stringify(user));
        if (user.role == Role.USER) {
          router.push("/main");
        }
        if (user.role == Role.ADMIN) {
          router.push("/");
        }
      },
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };
  const loaderUpdate = () => {
    setLoader(!loader);
  };

  return (
    // <section>
    //   <Typography variant="h2" color="primary">
    //     Autheticate
    //   </Typography>
    //   <form
    //     id="login-form"
    //     onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
    //   >
    //     <div>
    //       <TextField
    //         label={null}
    //         className="input-field"
    //         placeholder="Email* or Username*"
    //         type="text"
    //         fullWidth
    //         value={values.email}
    //         onChange={handleChange}
    //         onBlur={validateField}
    //         name="email"
    //         inputProps={{
    //           autoComplete: "new-password",
    //           form: {
    //             autoComplete: "off",
    //           },
    //         }}
    //       />
    //       {errors.email && <div className="error_text">{errors.email}</div>}
    //     </div>

    //     <div>
    //       <PasswordToggleInput
    //         value={values.password}
    //         onChange={handleChange}
    //         onBlur={validateField}
    //         name="password"
    //         placeholder={"Password*"}
    //       />
    //       {errors.password && (
    //         <div className="error_text">{errors.password}</div>
    //       )}
    //     </div>

    //     <Typography
    //       component={Link}
    //       href={"/recover-password"}
    //       variant="body1"
    //       color="primary"
    //       className="Link"
    //     >
    //       Forgot Password?
    //     </Typography>

    //     <ErrorApiText error={isLoginError} />

    //     <LoadingApi loading={isLoginLoading}>
    //       <button className="btn gradient-btn" type="submit">
    //         Login
    //       </button>
    //     </LoadingApi>

    //     <div className="register">
    //       <Typography variant="body1" color="primary">
    //         Don't have an account?
    //       </Typography>
    //       <Link className="btn secondary-btn block" href={"/register"}>
    //         Register
    //       </Link>
    //     </div>
    //   </form>
    // </section>
    <section>
      <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
      <p className="mb-4">Enter your credentials to access your account.</p>
      <form onSubmit={(event) => handleSubmit(event, onSubmit, onSubmitError)}>
        <IconField
          label="Username"
          type="text"
          placeholder="Enter Your Username"
          icon={Mail}
        />
        <IconField
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter Your Password"
        />
        <LoaderButton
          content={"Login"}
          variant={"contained"}
          type="submit"
          loading={loader}
          onClick={loaderUpdate}
        />
      </form>
      <p className="mt-4 text-center">
        New here?{" "}
        <a href="#" className="text-blue-500">
          Sign Up for Free!
        </a>
      </p>
    </section>
  );
};

export default Login;
