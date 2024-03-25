"use client";
import { Typography, TextField, Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";
import Link from "next/link";
import "../auth.scss";

const Login = () => {
  const router = useRouter();

  return (
    <section>
      <Typography variant="h2" color="primary">
        Autheticate
      </Typography>
      <form id="login-form" onSubmit={(e) => e.preventDefault()}>
        <TextField
          label={null}
          className="input-field"
          placeholder="Username*"
          type="text"
          inputProps={{
            autoComplete: "new-password",
            form: {
              autoComplete: "off",
            },
          }}
        />
        <PasswordToggleInput />

        <Typography
          component={Link}
          href={"/forgot-password"}
          variant="body1"
          color="primary"
          className="Link"
        >
          Forgot Password?
        </Typography>

        <button
          variant="contained"
          color="primary"
          className="btn gradient-btn"
          onClick={() => router.push("/main")}
        >
          Login
        </button>

        <div className="register">
          <Typography variant="body1" color="primary">
            Don't have an account?
          </Typography>
          <button
            variant="contained"
            color="primary"
            className="btn secondary-btn"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
