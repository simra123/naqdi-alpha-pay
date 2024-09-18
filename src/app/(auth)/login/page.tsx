"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useFormValidation from "@/hooks/useFormValidation";
import { loginSchema } from "@/models/login";
import { useApi } from "@/hooks/useApi";
import { loginApi } from "@/services/auth";
import { callApiHook } from "@/utils/apifuncs";
import ErrorApiText from "@/components/common/ErrorApiText";
import { Role } from "@/constants/roles";
import IconField from "@/components/common/IconField";
import { Lock, Mail } from "@mui/icons-material";
import LoaderButton from "@/components/common/LoaderButton";

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
      successCallBack: async (response) => {
        const { token, user } = response?.data;
        window?.localStorage?.setItem("token", token);
        window?.localStorage?.setItem("user", JSON.stringify(user));

        if (user?.role == Role.USER) {
          router.push("/onboarding");
        }
        if (user?.role == Role.ADMIN) {
          router.push("/");
        }
      },
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };

  return (
    <section className="mt-[100px]">
      <h1 className="text-h2 font-semibold mb-4 text-blackGrey-100">
        Welcome Back!
      </h1>
      <p className="mb-4 text-p120">
        Enter your credentials to access your account.
      </p>
      <form
        onSubmit={(event) => handleSubmit(event, onSubmit, onSubmitError)}
        className="mt-20"
      >
        <IconField
          label="Username"
          wrapperClassName="mb-6"
          type="text"
          error={errors.email}
          value={values.email}
          onChange={handleChange}
          onBlur={validateField}
          name="email"
          placeholder="Enter Your Email"
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
          placeholder="Enter Your Password"
        />
        <Link
          href={"/recover-password"}
          className="text-purple-100 text-input font-semibold block text-end mb-14"
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
      <p className="mt-6 text-center text-button">
        New here?{" "}
        <Link href="/register" className="text-purple-100 font-medium">
          Sign Up
        </Link>{" "}
        for Free!
      </p>
    </section>
  );
};

export default Login;
