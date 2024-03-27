"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Typography, TextField, Button } from "@mui/material";

import "../auth.scss";
import "./forgot.scss";
import { ForgotSchema } from "@/models/Forgot";
import useFormValidation from "@/hooks/useFormValidation";

const ForgotPassword = () => {
  const router = useRouter();
  const initialValues = {
    email: "",
  };

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, ForgotSchema);

  const onSubmit = () => {
    // Your submission logic here
    router.push("/main");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };
  return (
    <section className="password_forgot_page">
      <Typography variant="h2" color="primary">
        Recover your account
      </Typography>

      <Typography variant="body1" color="primary" className="heading_caption">
        Enter the email address registered with your HAYVN account and we will
        email you instructions on how to reset your password.
      </Typography>

      <form
        id="login-form"
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
      >
        <div>
          <TextField
            label={null}
            className="input-field"
            placeholder="Email*"
            fullWidth
            type="email"
            onBlur={validateField}
            name="email"
            onChange={handleChange}
            value={values.email}
            inputProps={{
              autoComplete: "new-password",
              form: {
                autoComplete: "off",
              },
            }}
          />
          {errors.email && <div className="error_text">{errors.email}</div>}
        </div>

        <Button
          variant="contained"
          color="primary"
          className="btn gradient-btn"
          type="submit"
        >
          Send Instruction to recover account
        </Button>
        <p className="note">
          NOTE: It is extremely important to ensure that email registered for
          your account is valid and up-to-date. If you lose your password or
          otherwise lose access to your account, the only way to regain access
          is by resetting the password, which requires access to the email
          address registered. If you do not have access to the email address,
          you may not be able to recover your account. In this case, please
          contact us at{" "}
          <Link className="Link" href="#">
            info@hayvnglobal.com
          </Link>
        </p>
      </form>
    </section>
  );
};

export default ForgotPassword;
