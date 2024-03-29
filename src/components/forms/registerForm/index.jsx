"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ReCaptcha from "react-google-recaptcha";
import { Typography, TextField, Button } from "@mui/material";

import { LegalSchema, RegisterSchema } from "@/models/Register";

import { forms } from "@/constants/registerforms";

import useFormValidation from "@/hooks/useFormValidation";

import SelectBox from "@/components/common/SelectBox";
import PasswordToggleInput from "@/components/common/PasswordToggleInput";

import "./registerForm.scss";

const options = [
  {
    value: "private-company-non-regulated",
    label: "Private Company (Non-reqgulated)",
  },
  {
    value: "listed-company-non-regulated",
    label: "Listed Company (Non-regulated)",
  },
];

const IndividualForm = ({ activeForm }) => {
  const router = useRouter();
  const initialValues = {
    legalName: "",
    entityType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  };

  const current_schema =
    activeForm == forms.LegalEntity ? LegalSchema : RegisterSchema;

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
    setErrors,
  } = useFormValidation(initialValues, current_schema);

  const onSubmit = () => {
    // Your submission logic here

    alert("Form submitted successfully!");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [activeForm]);

  return (
    <div className="register_form">
      <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
        {activeForm == forms.LegalEntity && (
          <div className="register_form__legalEnitiy">
            <div className="register_form__trader__heading">
              <Typography
                variant="h5"
                color="primary"
                className="form-label-bold"
              >
                Legal Entity Details
              </Typography>
            </div>
            <div className="flex input_gap flex-col">
              <div>
                <TextField
                  placeholder="Legal Name*"
                  className="input-field"
                  name="legalName"
                  value={values.legalName}
                  onChange={handleChange}
                  onBlur={validateField}
                  fullWidth
                />
                {errors.legalName && (
                  <div className="error_text">{errors.legalName}</div>
                )}
              </div>
              <div>
                <SelectBox
                  onChange={handleChange}
                  options={options}
                  name={"entityType"}
                  onBlur={validateField}
                  value={values.entityType}
                  placeholder={"Select Entity Type*"}
                />
                {errors.entityType && (
                  <div className="error_text">{errors.entityType}</div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="register_form__trader">
          <div className="register_form__trader__heading">
            {activeForm == forms.LegalEntity ? (
              <div className="mb-1">
                <Typography
                  variant="h5"
                  color="primary"
                  className="form-label-bold"
                >
                  Authorised Representative
                </Typography>
                <Typography variant="body1" color="primary">
                  Please tell us the details of the User who will be the
                  authorised representative on Alphaspay.
                </Typography>
              </div>
            ) : (
              <Typography
                variant="h5"
                color="primary"
                className="form-label-bold"
              >
                Trader
              </Typography>
            )}
          </div>
          <div className="flex input_gap flex-col">
            <div className="flex input_gap">
              <div>
                <TextField
                  placeholder="First Name*"
                  className="input-field"
                  fullWidth
                  onBlur={validateField}
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  name="firstName"
                />
                {errors.firstName && (
                  <div className="error_text">{errors.firstName}</div>
                )}
              </div>
              <div>
                <TextField
                  placeholder="Middle Name"
                  className="input-field"
                  fullWidth
                  onBlur={validateField}
                  type="text"
                  value={values.middleName}
                  onChange={handleChange}
                  name="middleName"
                />
              </div>
              <div>
                <TextField
                  placeholder="Last Name*"
                  className="input-field"
                  fullWidth
                  onBlur={validateField}
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  name="lastName"
                />
                {errors.lastName && (
                  <div className="error_text">{errors.lastName}</div>
                )}
              </div>
            </div>
            <div>
              <TextField
                placeholder="Email*"
                className="input-field"
                fullWidth
                onBlur={validateField}
                type="email"
                value={values.email}
                onChange={handleChange}
                name="email"
              />
              {errors.email && <div className="error_text">{errors.email}</div>}
            </div>
            <div>
              <TextField
                placeholder="Username*"
                className="input-field"
                fullWidth
                onBlur={validateField}
                type="text"
                value={values.userName}
                onChange={handleChange}
                name="userName"
              />
              {errors.userName && (
                <div className="error_text">{errors.userName}</div>
              )}
            </div>
          </div>
        </div>
        <div className="register_form__password">
          <div className="register_form__password__heading">
            <Typography
              variant="h5"
              color="primary"
              className="form-label-bold"
            >
              Password
            </Typography>
          </div>
          <div className="flex input_gap flex-col">
            <div className="item">
              <div>
                <PasswordToggleInput
                  placeholder="Password*"
                  onBlur={validateField}
                  type="text"
                  value={values.password}
                  onChange={handleChange}
                  name="password"
                />

                {errors.password && (
                  <div className="error_text">{errors.password}</div>
                )}
              </div>
              <Typography variant="body1" color="primary">
                <span>Security policies</span>: Use 8 or more characters with a
                mix of letters, numbers, special & uppercase characters.
              </Typography>
            </div>
            <div>
              <PasswordToggleInput
                placeholder="Create Password*"
                // onBlur={validateField}
                value={values.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                key={12}
              />
              {values.password != values.confirmPassword && (
                <div className="error_text">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div>
            <ReCaptcha
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              className="mt-1"
              key={activeForm}
              onChange={(token) =>
                handleChange({ target: { name: "captcha", value: token } })
              }
            />
            {errors.captcha && (
              <div className="error_text">{errors.captcha}</div>
            )}
          </div>

          <div className="register_form__privacy mt-1">
            <Typography variant="body1" className="note">
              The following documents create a legally binding contract between
              You and HAYVN. Please read these legal documents carefully. To
              confirm your understanding and acceptance of the{" "}
              <Link href="/privacy-policy" target="_blank">
                {" "}
                Privacy Policy
              </Link>
              ,
              <Link href="/terms&conditions" target="_blank">
                Terms and Conditions
              </Link>
              ,
              <Link href="/user-agreement" target="_blank">
                {" "}
                User Agreement{" "}
              </Link>
              and
              <Link href="/custody-agreement" target="_blank">
                {" "}
                Custody Agreement
              </Link>
              , click "Register Account".
            </Typography>
          </div>

          <div className="footer mt-1">
            <button className="btn gradient-btn" type="submit">
              Register Account
            </button>

            <p className="mt-1">
              I already have an account? <Link href="/login">Login!</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IndividualForm;
