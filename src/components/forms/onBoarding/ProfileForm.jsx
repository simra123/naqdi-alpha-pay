"use client";

import React, { useMemo } from "react";
import { TextField, Typography } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import countryList from "react-select-country-list";
import useFormValidation from "@/hooks/useFormValidation";
import { ProfileSchema } from "@/models/Profile";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { ProfileSetupApi } from "@/services/onBoarding";
import { useDispatch } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";
import { STEPS } from "@/constants/onboarding";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import useLocalStorage from "@/hooks/useLocalStorage";

const initialValues = {
  addressLine1: "",
  addressLine2: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
};

const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useLocalStorage("user");
  const [isProfileLoading, isProfileError, callProfileApi] = useApi();
  const options = useMemo(() => {
    const data = countryList()
      .getData()
      .map(({ label }) => {
        return {
          label: label,
          value: label,
        };
      });
    return data;
  }, []);

  console.log(user);

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, ProfileSchema);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callProfileApi(
        ProfileSetupApi({
          address_line_1: values?.addressLine1,
          address_line_2: values?.addressLine2,
          country: values?.country,
          state: values?.state,
          city: values?.city,
          postal_code: values?.postalCode,
        })
      ),
      successCallBack: (response) => {
        dispatch(
          setStep({
            previous_step: STEPS.PROFILE,
            current_step: STEPS.PHONEVALIDATION,
            next_step: STEPS?.MFASETUP,
          })
        );
      },
    });
  };
  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
      <p>
        Your personal information is crucial for us to identity you and keep
        your investments secure. The below profile information helps us to do
        that.
      </p>

      <div className="register_form__trader">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Trader
          </Typography>
        </div>
        <div className="flex input_gap flex-col gap-5">
          <div className="flex input_gap gap-5">
            <TextField
              placeholder="First Name*"
              className="input-field flex-1"
              disabled
              value={user?.first_name}
            />
            <TextField
              placeholder="Middle Name"
              className="input-field flex-1"
              value={user?.middle_name}
              disabled
            />
            <TextField
              placeholder="Last Name*"
              className="input-field flex-1"
              disabled
              value={user?.last_name}
            />
          </div>
          <TextField
            placeholder="Email*"
            className="input-field"
            fullWidth
            disabled
            value={user?.email}
          />
        </div>
      </div>

      <div className="register_form__trader mt-16">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Country of Domicile Details
          </Typography>
        </div>
        <div className="flex input_gap flex-col gap-5">
          <div>
            <TextField
              placeholder="Address (line 1)*"
              className="input-field"
              onBlur={validateField}
              onChange={handleChange}
              value={values.addressLine1}
              name="addressLine1"
              fullWidth
            />
            {errors.addressLine1 && (
              <div className="error_text">{errors.addressLine1}</div>
            )}
          </div>
          <div>
            <TextField
              placeholder="Address (line 2)"
              className="input-field"
              value={values.addressLine2}
              onChange={handleChange}
              name="addressLine2"
              fullWidth
            />
          </div>
          <div>
            <SelectBox
              placeholder="Country*"
              options={options}
              name={"country"}
              onBlur={validateField}
              onChange={handleChange}
              value={values.country}
            />
            {errors.country && (
              <div className="error_text">{errors.country}</div>
            )}
          </div>
          <div>
            <TextField
              placeholder="Country/State*"
              className="input-field"
              name={"state"}
              onBlur={validateField}
              onChange={handleChange}
              value={values.state}
              fullWidth
            />
            {errors.state && <div className="error_text">{errors.state}</div>}
          </div>
          <div>
            <TextField
              placeholder="City*"
              className="input-field"
              fullWidth
              name={"city"}
              onBlur={validateField}
              onChange={handleChange}
              value={values.city}
            />
            {errors.city && <div className="error_text">{errors.city}</div>}
          </div>
          <div>
            <TextField
              placeholder="Postal Code"
              className="input-field"
              name={"postalCode"}
              onBlur={validateField}
              onChange={handleChange}
              value={values.postalCode}
              fullWidth
            />
          </div>
        </div>
      </div>

      <ErrorApiText error={isProfileError} />

      <p className="note mt-14">
        Please ensure your provided details are correct. Once your details are
        submitted for KYC approval they will be locked.
      </p>
      <div className="btn_wrapper text-right">
        <LoadingApi loading={isProfileLoading}>
          <button className="header_step_btn active fl" type="submit">
            Save & Next
          </button>
        </LoadingApi>
      </div>
    </form>
  );
};

export default ProfileForm;
