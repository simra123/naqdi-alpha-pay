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
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { registerApi } from "@/services/auth";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import IconField from "@/components/common/IconField";
import { Business, Lock, Mail, Person } from "@mui/icons-material";
import LoaderButton from "@/components/common/LoaderButton";
import IconSelectBox from "@/components/common/IconSelectBox";

const options = [
  {
    value: "private-company-non-regulated",
    label: "Private Company (Non-regulated)",
  },
  {
    value: "listed-company-non-regulated",
    label: "Listed Company (Non-regulated)",
  },
];

const IndividualForm = ({ activeForm }) => {
  const [isRegisterLoading, isRegisterError, callRegisterApi] = useApi();
  const router = useRouter();

  const initialValues = {
    legalName: "",
    entityType: "",
    // firstName: "",
    // middleName: "",
    // lastName: "",
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

  const onSubmit = async () => {
    const individualData = {
      // first_name: values?.firstName,
      // last_name: values.lastName,
      // middle_name: values?.middleName,
      username: values?.userName,
      email: values?.email,
      password: values?.password,
      confirm_password: values?.confirmPassword,
      user_type: activeForm,
      role: "USER",
    };

    const legalEntityData = {
      legal_name: values?.legalName,
      legal_type: values?.entityType,
    };

    const registerData =
      activeForm == forms.LegalEntity
        ? { ...legalEntityData, ...individualData }
        : individualData;

    await callApiHook({
      apiCall: callRegisterApi(registerApi(registerData)),
      successCallBack: () =>
        router.push(
          `/email-verification-required?email=${encodeURIComponent(
            values?.email
          )}`
        ),
      statusCode: 201,
    });
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
    <div className="register_form mt-10">
      <form
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
        className="flex flex-col gap-3"
      >
        {activeForm == forms.LegalEntity && (
          <>
            <IconField
              placeholder="Enter You Name"
              onBlur={validateField}
              type="text"
              value={values.legalName}
              onChange={handleChange}
              name="legalName"
              error={errors.legalName}
              label="Legal Name"
              icon={Person}
            />
            {/* <IconField
              placeholder="Enter Entity Type"
              onBlur={validateField}
              type="text"
              value={values.entityType}
              onChange={handleChange}
              name="entityType"
              error={errors.entityType}
              label="Select Entity Type"
              icon={Person}
            /> */}
            <IconSelectBox
              label="Select Entity Type"
              placeholder="Enter Entity Type"
              icon={Business}
              onChange={handleChange}
              value={values?.legal_type}
              options={options}
            />
          </>
        )}
        <IconField
          placeholder="Enter You Username"
          onBlur={validateField}
          type="text"
          value={values.userName}
          onChange={handleChange}
          name="userName"
          error={errors.userName}
          label="Username"
          icon={Person}
        />
        <IconField
          placeholder="Enter You Email"
          onBlur={validateField}
          type="email"
          value={values.email}
          onChange={handleChange}
          name="email"
          error={errors.email}
          label="Email"
          icon={Mail}
        />
        <IconField
          placeholder="Enter You Password"
          onBlur={validateField}
          type="password"
          info="Use 8 or more characters with a mix of letters, numbers,
                special & uppercase characters."
          value={values.password}
          onChange={handleChange}
          name="password"
          error={errors.password}
          label="Password"
          icon={Lock}
        />
        <IconField
          placeholder="Enter You Password"
          onBlur={validateField}
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          error={errors.confirmPassword}
          label="Confirm Password"
          icon={Lock}
        />

        <div>
          <ReCaptcha
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            className="mt-1"
            key={activeForm}
            onChange={(token) =>
              handleChange({ target: { name: "captcha", value: token } })
            }
          />
          {errors.captcha && <div className="error_text">{errors.captcha}</div>}
        </div>

        <div className="mt-3">
          <p className="text-blackGrey-100">
            The following documents create a legally binding contract between
            You and Alphaspay. Please read these legal documents carefully. To
            confirm your understanding and acceptance of the{" "}
            <Link
              className="text-purple-100 underline font-medium"
              href={"/privacy-policy"}
            >
              Privacy Policy
            </Link>
            ,
            <Link
              className="text-purple-100 underline font-medium"
              href={"/terms&conditions"}
            >
              Terms and Conditions
            </Link>
            ,{" "}
            <Link
              className="text-purple-100 underline font-medium"
              href={"/user-agreement"}
            >
              User Agreement
            </Link>{" "}
            and{" "}
            <Link
              className="text-purple-100 underline font-medium"
              href={"/custody-agreement"}
            >
              Custody Agreement
            </Link>
            , click "Register".
          </p>
        </div>

        <div className="footer mt-10">
          <ErrorApiText error={isRegisterError} />

          <LoaderButton
            variant={"contained"}
            content={"Register"}
            loading={isRegisterLoading}
            type="submit"
          />
        </div>
        <p className="mt-6 text-center text-button">
          Got an account? Proceed to{" "}
          <Link href="/login" className="text-purple-100 font-medium">
            login
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default IndividualForm;
