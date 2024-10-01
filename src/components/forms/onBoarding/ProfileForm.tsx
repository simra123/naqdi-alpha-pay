"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import useFormValidation from "@/hooks/useFormValidation";
import { ProfileSchema } from "@/models/Profile";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { ProfileSetupApi } from "@/services/onBoarding";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/store/slices/onboarding.slice";
import { STEPS } from "@/constants/onboarding";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import useLocalStorage from "@/hooks/useLocalStorage";
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";
import { LocationOn, Mail, Person } from "@mui/icons-material";

import countriesJson from "@/constants/countries.json";
import IconSelectBox from "@/components/common/IconSelectBox";
import IconField from "@/components/common/IconField";
import LoaderButton from "@/components/common/LoaderButton";

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
  const user: any = useLocalStorage("user");
  const userDetails = useSelector((state: any) => state.user.data);
  const { getUserDetails } = useGetUserDetaiils();
  const [isProfileLoading, isProfileError, callProfileApi] = useApi();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, ProfileSchema);

  useEffect(() => {
    const data = userDetails?.userDetails;
    if (data) {
      setValues({
        addressLine1: data?.address_line_1,
        addressLine2: data?.address_line_2,
        country: data?.country,
        state: data?.state,
        city: data?.city,
        postalCode: data?.postal_code,
      });

      setStates(
        countriesJson.find((country) => country?.value == data?.country)?.states
      );
      const currentCities = countriesJson
        .find((country) => country?.value == data?.country)
        .states.find((state) => state.value == data?.state)?.cities;

      const mappedCities = currentCities?.map((city) => {
        return {
          label: city,
          value: city,
        };
      });

      setCities(mappedCities);
    }
  }, [userDetails]);

  const handleChangeMiddleware = (e) => {
    const { name, value } = e.target;

    if (name == "country") {
      setValues({ ...values, country: value, state: null, city: null });
      setCities([]);
      setStates([]);

      setStates(
        countriesJson.find((country) => country?.value == value).states
      );

      return;
    }
    if (name == "state") {
      setValues({ ...values, state: value, city: null });
      setCities([]);

      const currentCities = countriesJson
        .find((country) => country?.value == values?.country)
        .states.find((state) => state.value == value)?.cities;

      const mappedCities = currentCities?.map((city) => {
        return {
          label: city,
          value: city,
        };
      });

      setCities(mappedCities);

      return;
    }
  };

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
      successCallBack: (response: any) => {
        dispatch(
          setStep({
            previous_step: STEPS.PROFILE,
            current_step: STEPS.PHONEVALIDATION,
            next_step: STEPS?.MFASETUP,
          })
        );
        getUserDetails();
      },
    });
  };

  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };



  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
      <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
        <h4 className="text-blackGrey-100 text-h3.5 font-semibold">Trader</h4>

        <div className="details flex mt-3 flex-wrap">
          <div className="gap-3 flex items-center p-2 md:w-1/3">
            <div className="text-purple-100 bg-light-gray-10 aspect-square w-12 rounded-full p-3">
              <Person />
            </div>

            <div className="flex flex-col gap-1">
              <span className=" text-custom-title-gray font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-[13px] text-custom-caption-gray font-medium">
                Full Name
              </span>
            </div>
          </div>

          <div className="gap-3 flex items-center p-2">
            <div className="text-purple-100 bg-light-gray-10 aspect-square w-12 rounded-full p-3">
              <Mail />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-custom-title-gray font-medium">
                {user?.email}
              </span>
              <span className="text-[13px] text-custom-caption-gray font-medium">
                Email
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 flex flex-col gap-3 mt-8">
        <div className="register_form__trader__heading">
          <h4 className="text-blackGrey-100 text-h3.5 font-semibold">
            Contry of Domicile Details
          </h4>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-2">
          <IconSelectBox
            options={countriesJson}
            onChange={handleChangeMiddleware}
            searchable
            error={errors.country}
            icon={LocationOn}
            label="Country"
            name="country"
            placeholder="Select your country"
            inputContainerClassName="!bg-blackGrey-filled-input"
            value={values.country}
          />

          <IconSelectBox
            options={states}
            inputContainerClassName="!bg-blackGrey-filled-input"
            onChange={handleChangeMiddleware}
            searchable
            disabled={!values?.country}
            error={errors.state}
            icon={LocationOn}
            label="State/Province"
            name="state"
            placeholder="Select your state/province"
            value={values.state}
          />

          <IconSelectBox
            options={cities}
            inputContainerClassName="!bg-blackGrey-filled-input"
            onChange={handleChange}
            searchable
            disabled={!values?.state}
            error={errors.city}
            icon={LocationOn}
            label="City"
            name="city"
            placeholder="Select your City"
            value={values.city}
          />

          <IconField
            inputContainerClassName="!bg-blackGrey-filled-input"
            placeholder="Enter Your Address"
            name={"addressLine1"}
            onBlur={validateField}
            onChange={handleChange}
            value={values.addressLine1}
            error={errors.addressLine1}
            icon={LocationOn}
            label="Address Line 1"
          />
          <IconField
            inputContainerClassName="!bg-blackGrey-filled-input"
            placeholder="Enter Your Address"
            name={"addressLine2"}
            onBlur={validateField}
            onChange={handleChange}
            value={values.addressLine2}
            icon={LocationOn}
            label="Address Line 2"
          />

          <IconField
            inputContainerClassName="!bg-blackGrey-filled-input"
            placeholder="Enter Postal Code"
            name={"postalCode"}
            onBlur={validateField}
            onChange={handleChange}
            value={values.postalCode}
            icon={LocationOn}
            label="Postal Code"
          />
        </div>
        <ErrorApiText error={isProfileError} />

        <p className="text-blackGrey-100">
          Please ensure your provided details are correct. Once your details are
          submitted for KYC approval they will be locked.
        </p>

        <div className="mt-12 max-w-[360px]">
          <LoaderButton
            content={"Save & Continue"}
            loading={isProfileLoading}
            type="submit"
            disabled={
              !values?.country ||
              !values?.state ||
              !values?.city ||
              !values?.addressLine1 ||
              !values?.postalCode
            }
            variant={"contained"}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
