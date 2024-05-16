import React, { useEffect, useState } from "react";
import { Typography, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import useFormValidation from "@/hooks/useFormValidation";
import { codeSchema, PhoneSchema } from "@/models/Phone";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { PhoneSetupApi } from "@/services/onBoarding";
import { STEPS } from "@/constants/onboarding";
import { setStep } from "@/store/slices/onboarding.slice";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import { userDetailsApi } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";

const PhoneValidation = () => {
  const dispatch = useDispatch();
  const [isPhoneLoading, isPhoneError, callPhoneApi] = useApi();
  const [isCodeLoading, isCodeError, callCodeApi] = useApi();
  const [showCode, setShowCode] = useState(false);
  const { getUserDetails } = useGetUserDetaiils();
  const userDetails = useSelector((state: any) => state.user.data);
  const initialValuePhone = {
    phone: "",
  };

  const initialValueCode = {
    code: "000000",
  };

  const {
    errors: phoneErrors,
    handleChange: handleChangePhone,
    handleSubmit: handleSubmitPhone,
    validateField: validatePhone,
    values: phoneValues,
    setValues: setPhoneValues,
  } = useFormValidation(initialValuePhone, PhoneSchema);

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValueCode, codeSchema);

  useEffect(() => {
    const data = userDetails?.userDetails;
    if (data && data?.phone_number) {
      setPhoneValues({
        phone: data?.phone_number,
      });
      setShowCode(true);
    }
  }, [userDetails]);

  const onSubmitPhone = async () => {
    await callApiHook({
      apiCall: callPhoneApi(
        PhoneSetupApi({
          phone_number: phoneValues?.phone,
        })
      ),
      successCallBack: (response) => {
        setShowCode(true);
        getUserDetails();
      },
    });
  };
  const onSubmitPhoneError = () => {
    window.scrollTo(0, 0);
  };
  const onSubmit = () => {
    dispatch(
      setStep({
        previous_step: STEPS.PHONEVALIDATION,
        current_step: STEPS.MFASETUP,
        next_step: STEPS?.IDENTITYCHECK,
      })
    );
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

        <LoadingApi loading={isPhoneLoading}>
          <form
            onSubmit={(e) =>
              handleSubmitPhone(e, onSubmitPhone, onSubmitPhoneError)
            }
          >
            <div>
              <div className="flex items-center tel_input_wrapper">
                <PhoneInput
                  buttonClass="input-field"
                  inputClass="input-field"
                  onChange={(value) =>
                    handleChangePhone({
                      target: { name: "phone", value },
                    })
                  }
                  disabled={showCode}
                  value={phoneValues.phone}
                  onBlur={validatePhone}
                  enableSearch
                  specialLabel=""
                  inputProps={{
                    name: "phone",
                  }}
                />

                <button
                  className="btn-yellow w-1/5 font-semibold"
                  type="submit"
                  disabled={showCode}
                >
                  Send Sms
                </button>
              </div>

              {phoneErrors.phone && (
                <div className="error_text">{phoneErrors.phone}</div>
              )}
            </div>
            <ErrorApiText error={isPhoneError} />
            {showCode && (
              <p className="success note mt-5">
                An SMS was sent to the mobile phone number you entered. Please
                enter the code received to validate your mobile number.
              </p>
            )}
          </form>
        </LoadingApi>
        {showCode && (
          <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
            {/* <div className="register_form__trader__heading mt-8">
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
            </div> */}

            <div className="btn_wrapper text-right">
              <button className="header_step_btn active fl" type="submit">
                Validate & Next
              </button>
            </div>
          </form>
        )}
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
