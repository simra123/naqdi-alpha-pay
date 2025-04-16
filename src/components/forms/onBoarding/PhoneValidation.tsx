import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import useFormValidation from "@/hooks/useFormValidation";
import { codeSchema, PhoneSchema } from "@/models/phone";
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
import { getUserTimezone, getCountryCodeFromTimezone } from "@/utils/timezones";

const PhoneValidation = () => {
  const dispatch = useDispatch();
  const [isPhoneLoading, isPhoneError, callPhoneApi] = useApi();
  const [isCodeLoading, isCodeError, callCodeApi] = useApi();
  const [showCode, setShowCode] = useState(false);
  const { getUserDetails } = useGetUserDetaiils();
  const userDetails = useSelector((state: any) => state.user.data);
  const [defaultCountry, setDefaultCountry] = useState<string>("us");
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

  useEffect(() => {
    const timezone = getUserTimezone();
    const country = getCountryCodeFromTimezone(timezone);
    setDefaultCountry(country?.toLowerCase());
  }, []);

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
        onSubmit();
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

  };

  return (
    <div className="flex flex-col gap-5 bg-white mt-8 p-12 rounded-small">
      <h4 className="font-semibold text-black-100 text-h3.5">
        Phone Validation
      </h4>

      <p className="text-black-100 text-button">
        Please provide the Mobile Number you wish to register with your account.
      </p>
      <p className="mt-4 text-black-100">
        Note: Alphapay is committed to providing a global service to all of our
        customers. However, certain mobile networks can be unreliable for
        various reasons. In the event of difficulties validating your mobile
        number please contact Alphaspay support for an alternative verification
        method.
      </p>
      <div className="mt-6">
        <div className="mb-2">
          <h5 className="font-medium text-input">Phone Number</h5>
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
                country={defaultCountry}
                value={phoneValues.phone}
                onBlur={validatePhone}
                enableSearch
                specialLabel=""
                inputProps={{
                  name: "phone",
                }}
              />

              {phoneErrors.phone && (
                <p className="mt-[4px] ml-4 text-red-error-dark text-subtitle">
                  {phoneErrors.phone}
                </p>
              )}
            </div>
            <ErrorApiText error={isPhoneError} />

            <div className="mt-12 max-w-[360px]">
              <LoaderButton
                content={"Save & Continue"}
                type="submit"
                variant={"contained"}
              />
            </div>

            {/* {!showCode && (
              <div className="mt-12 max-w-[360px]">
                <LoaderButton
                  content={"Send Code"}
                  type="submit"
                  variant={"contained"}
                />
              </div>
            )} */}

            {/* {showCode && (
              <p className="mt-6 text-black-100">
                An SMS was sent to the mobile phone number you entered. Please
                enter the code received to validate your mobile number.
              </p>
            )} */}
          </form>
        </LoadingApi>
        {/* {showCode && ( */}
        {/* <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
          <div className="mt-12 max-w-[360px]">
            <LoaderButton
              content={"Save & Continue"}
              type="submit"
              variant={"contained"}
            />
          </div>
        </form> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default PhoneValidation;
