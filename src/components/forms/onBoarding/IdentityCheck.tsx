"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import countryList from "react-select-country-list";
import useFormValidation from "@/hooks/useFormValidation";
import { IDENTITY_FORMATS, STEPS } from "@/constants/onboarding";
import { IdentityCheckSchema } from "@/models/IdentityCheck";
import { useApi } from "@/hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { callApiHook } from "@/utils/apifuncs";
import { SubmitKYCApi } from "@/services/onBoarding";
import { setStep } from "@/store/slices/onboarding.slice";
import { IdentityCheckState } from "./types";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";
import useGetUserDetaiils from "@/hooks/useGetUserDetaiils";
import { getUrlOrObjectUrl, urlToFile } from "@/utils/getImageSrcType";

const IdentityCheck = () => {
  const dispatch = useDispatch();
  const { getUserDetails } = useGetUserDetaiils();
  const user: any = useSelector((state: any) => state?.user?.data);
  const front = useRef(null);
  const back = useRef(null);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [isSubmitKYCLoading, isSubmitKYCError, callSubmitKYCApi] = useApi();
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
  const documentFormatsList = [
    {
      name: "National Identity Card",
      format: IDENTITY_FORMATS.ID_CARD,
    },
    {
      name: "Passport",
      format: IDENTITY_FORMATS.PASSPORT,
    },
    {
      name: "Driver's License",
      format: IDENTITY_FORMATS.DRIVER_LICENSE,
    },
  ];

  const initialValues: IdentityCheckState = {
    country: "",
    documentFormat: "",
    document: {
      front: null,
      back: null,
    },
  };

  const {
    values,
    setValues,
    errors,
    handleChange,
    handleSubmit,
    validateField,
  } = useFormValidation(initialValues, IdentityCheckSchema);



  const setUserData = async () => {
    setValues({
      documentFormat: user?.userDetails?.file_type,
      document: {
        front: await urlToFile(user?.userDetails?.front_image),
        back: await urlToFile(user?.userDetails?.back_image),
      },
      country: user?.userDetails?.country,
    });
    setUpdateLoading(false);
  };

  useEffect(() => {
    setUserData();
  }, [user]);

  const onSubmit = async () => {
    await callApiHook({
      apiCall: callSubmitKYCApi(
        SubmitKYCApi({
          file_type: values?.documentFormat,
          front_image: values.document?.front,
          back_image: values.document?.back,
          country: values.country,
        })
      ),
      successCallBack: () => {
        dispatch(
          setStep({
            previous_step: STEPS.IDENTITYCHECK,
            current_step: STEPS.KYCAPPROVAL,
            next_step: STEPS?.FEESCHEDULE,
          })
        );
        getUserDetails();
      },
    });
  };
  const onSubmitError = () => {
    window.scrollTo(0, 500);
  };

  const handleFormatChange = (format) => () => {
    setValues((pre) => ({ ...pre, documentFormat: format }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
      <h2 className="large_heading_bold">Know Your Customer Identity Check</h2>
      <LoadingApi loading={updateLoading}>
        <p>
          Please fill in the details so we can proceed with you Identity
          Confirmation
        </p>

        <div className="register_form__trader">
          <div className="register_form__trader__heading">
            <Typography
              variant="h5"
              color="primary"
              className="form-label-bold"
            >
              Country
            </Typography>
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
            {errors?.country && (
              <div className="error_text">{errors?.country}</div>
            )}
          </div>

          {values.country && (
            <>
              <div className="register_form__trader__heading mt-10">
                <Typography
                  variant="h5"
                  color="primary"
                  className="form-label-bold"
                >
                  Select Document Format
                </Typography>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {documentFormatsList.map(({ format, name }) => (
                  <DocumentFormatCard
                    format={format}
                    name={name}
                    handleFormatChange={handleFormatChange}
                    value={values.documentFormat}
                  />
                ))}
              </div>
              {errors.documentFormat && (
                <div className="error_text">{errors?.documentFormat}</div>
              )}
            </>
          )}
        </div>

        {values.documentFormat && (
          <div>
            <div className="register_form__trader__heading mt-10">
              <Typography
                variant="h5"
                color="primary"
                className="form-label-bold"
              >
                Select Documents
              </Typography>
            </div>
            <div className="mb-2">
              <input
                type="file"
                name="document.front"
                onBlur={validateField}
                onChange={handleChange}
                ref={front}
                hidden
                accept="image/*"
              />
              <div className="flex gap-6 items-center mb-2">
                <button
                  type="button"
                  className="btn-secondary min-w-max"
                  onClick={() => front?.current?.click()}
                >
                  Choose Front File
                </button>
                <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                  {values.document?.front?.name}
                </span>
              </div>
              {values.document.front && (
                <img
                  src={getUrlOrObjectUrl(values.document.front)}
                  alt="front side"
                  className="min-w-full"
                />
              )}
            </div>

            <div>
              <input
                type="file"
                name="document.back"
                onBlur={validateField}
                onChange={handleChange}
                ref={back}
                hidden
                accept="image/*"
              />
              <div className="flex gap-6 items-center mb-2">
                <button
                  type="button"
                  className="btn-secondary  min-w-max"
                  onClick={() => back?.current?.click()}
                >
                  Choose Back File
                </button>
                <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                  {values.document?.back?.name}
                </span>
              </div>
              {values.document.back && (
                <img
                  src={getUrlOrObjectUrl(values.document.back)}
                  alt="bak side"
                  className="min-w-full"
                />
              )}
            </div>

            {errors.document && (
              <div className="error_text">{errors?.document}</div>
            )}
          </div>
        )}

        <p className="note mt-14">
          Please ensure your provided details are correct. Once your details are
          submitted for KYC approval they will be locked.
        </p>
        <ErrorApiText error={isSubmitKYCError} />
        <div className="btn_wrapper text-right">
          <LoadingApi loading={isSubmitKYCLoading}>
            <button className="header_step_btn active fl" type="submit">
              Save & Next
            </button>
          </LoadingApi>
        </div>
      </LoadingApi>
    </form>
  );
};

export default IdentityCheck;

export const DocumentFormatCard = ({
  name,
  handleFormatChange,
  format,
  value,
}) => {
  return (
    <div
      onClick={handleFormatChange(format)}
      className={`card p-5 items-center flex gap-6 shadow-md border cursor-pointer transition-all ${
        value == format
          ? `bg-slate-500 text-white`
          : `hover:bg-slate-100 hover:text-gray-950 bg-white`
      }`}
    >
      <div className="rounded-full secondary_section p-1">
        <img src="/Id_card.svg" alt="ID_Card" />
      </div>
      <div className="name flex flex-col gap-0">
        <span className="font-bold">{name}</span>
        <span
          className={
            value == format ? `text-white text-sm` : `text-sm text-slate-500`
          }
        >
          Front & Back
        </span>
      </div>
    </div>
  );
};
