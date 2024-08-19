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
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";
import Loader from "@/components/common/Loader";
import LoaderButton from "@/components/common/LoaderButton";

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
    <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
      <h4 className="text-black-100 text-h3.5 font-semibold">
        Phone Validation
      </h4>

      <p className="text-button text-black-100">
        Please provide the Mobile Number you wish to register with your account.
      </p>
      <p className="text-black-100 mt-4">
        Note: Alphapay is committed to providing a global service to all of our
        customers. However, certain mobile networks can be unreliable for
        various reasons. In the event of difficulties validating your mobile
        number please contact Alphaspay support for an alternative verification
        method.
      </p>
      <div className="mt-6">
        <div className="mb-2">
          <h5 className="text-input font-medium">Phone Number</h5>
        </div>

        <LoadingApi loading={isPhoneLoading}>
          <form
            onSubmit={(e) =>
              handleSubmitPhone(e, onSubmitPhone, onSubmitPhoneError)
            }
          >
            <div>
              <PhoneInput
                inputClass="!rounded-large !py-3 w-[360px] max-w-full bg-filled-input !bg-blackGrey-filled-input focus:!border-1 focus:!border-light-gray hover:!border-light-gray !border-light-gray focus:!shadow-none hover:border-"
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

              {phoneErrors.phone && (
                <div className="error_text">{phoneErrors.phone}</div>
              )}
            </div>
            <ErrorApiText error={isPhoneError} />
            {showCode && (
              <p className="text-black-100 mt-6">
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

            <div className="mt-12 max-w-[360px]">
              <LoaderButton
                content={"Save & Continue"}
                type="submit"
                variant={"contained"}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneValidation;
