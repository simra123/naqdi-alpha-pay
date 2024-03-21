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
      <form id="login-form">
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

        <Button
          variant="contained"
          color="primary"
          className="btn gradient-btn"
          onClick={() => router.replace("/")}
        >
          Login
        </Button>

        <div className="register">
          <Typography variant="body1" color="primary">
            Don't have an account?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="btn secondary-btn"
            onClick={() => router.replace("/register")}
          >
            Register
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Login;
