import React from "react";
import { Typography, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import useFormValidation from "@/hooks/useFormValidation";
import { codeSchema, PhoneSchema } from "@/models/Phone";

const PhoneValidation = () => {
  const initialValuePhone = {
    phone: "",
  };

  const initialValueCode = {
    code: "",
  };

  const {
    errors: phoneErrors,
    handleChange: handleChangePhone,
    handleSubmit: handleSubmitPhone,
    validateField: validatePhone,
    values: phoneValues,
    setValues: setPhoneValues,
  } = useFormValidation(initialValuePhone, PhoneSchema);

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValueCode, codeSchema);

  const onSubmitPhone = () => {
    // Your submission logic here

    alert("Form submitted successfully!");
  };
  const onSubmitPhoneError = () => {
    window.scrollTo(0, 0);
    console.log("Form Not submitted successfully!");
  };
  const onSubmit = () => {
    // Your submission logic here

    alert("Form submitted successfully!");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 300);
    console.log("Form Not submitted successfully!");
  };

  return (
    <>
      <h2 className="large_heading_bold">Phone Validation</h2>
      <p>
        Please provide the Mobile Number you wish to register with your account.
      </p>
      <p className="note mt-4">
        Note: Alphapay is committed to providing a global service to all of our
        customers. However, certain mobile networks can be unreliable for
        various reasons. In the event of difficulties validating your mobile
        number please contact Alphaspay support for an alternative verification
        method.
      </p>
      <div className="register_form__trader mt-12">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="text-base">
            Enter Phone Number
          </Typography>
        </div>

        {/* <TextField placeholder="Phone*" className="input-field" fullWidth /> */}
        <form
          onSubmit={(e) => handleSubmit(e, onSubmitPhone, onSubmitPhoneError)}
        >
          <div>
            <div className="flex items-center tel_input_wrapper">
              <PhoneInput
                buttonClass="input-field"
                inputClass="input-field"
                onChange={handleChangePhone}
                value={phoneValues.phone}
                onBlur={validatePhone}
                enableSearch
                specialLabel=""
                inputProps={{
                  name: "phone",
                  autoFocus: true,
                }}
              />

              <button className="btn-yellow w-1/5 font-semibold" type="submit">
                Send Sms
              </button>
            </div>
            {phoneErrors.phone && (
              <div className="error_text">{phoneErrors.phone}</div>
            )}
          </div>
          <p className="success note mt-5">
            An SMS was sent to the mobile phone number you entered. Please enter
            the code received to validate your mobile number.
          </p>
        </form>

        <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
          <div className="register_form__trader__heading mt-8">
            <Typography variant="h5" color="primary" className="text-base">
              Enter Code
            </Typography>
            <div>
              <TextField
                className="input-field"
                onChange={handleChange}
                value={values.code}
                onBlur={validateField}
                name="code"
                fullWidth
                placeholder="EX: CODE!@"
              />
              {errors.code && <div className="error_text">{errors.code}</div>}
            </div>
          </div>

          <div className="btn_wrapper text-right">
            <button className="header_step_btn active fl" type="submit">
              Validate & Next
            </button>
          </div>
        </form>
      </div>
      <p className="note mt-6">
        This phone number is linked with your account and has been already
        registered. If you want to change your approved phone number, You can do
        so by sending an email to compliance email address
        <a href="#" className="underline underline-offset-2">
          {" "}
          compliance@alphaspay.com{" "}
        </a>
      </p>
    </>
  );
};

export default PhoneValidation;
