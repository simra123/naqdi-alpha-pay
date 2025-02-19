"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import countriesJson from "@/constants/countries.json";
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
import IconSelectBox from "@/components/common/IconSelectBox";
import { Add, LocationOn } from "@mui/icons-material";
import { DocumentFormat } from "@/assets/Svgs";
import LoaderButton from "@/components/common/LoaderButton";

const IdentityCheck = () => {
  const dispatch = useDispatch();
  const { getUserDetails } = useGetUserDetaiils();
  const user: any = useSelector((state: any) => state?.user?.data);
  const front = useRef(null);
  const back = useRef(null);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [isSubmitKYCLoading, isSubmitKYCError, callSubmitKYCApi] = useApi();

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
        front: user?.userDetails?.front_image,
        back: user?.userDetails?.back_image,
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

  const clearImagesHandler = () => {
    setValues((pre) => ({
      ...pre,
      document: {
        front: null,
        back: null,
      },
    }));
  };

  const handleFormatChange = (format) => () => {
    setValues((pre) => ({ ...pre, documentFormat: format }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
      <div className="bg-white rounded-small p-12 flex flex-col gap-5 mt-8">
        <h4 className="text-black-100 text-h3.5 font-semibold">
          Identity Check
        </h4>
        <LoadingApi loading={updateLoading}>
          <p className="text-button text-black-100">
            Please fill in the details so we can proceed with you Identity
            Confirmation
          </p>

          <div className="max-w-[360px] mt-3">
            <IconSelectBox
              options={countriesJson}
              onChange={handleChange}
              searchable
              error={errors.country}
              icon={LocationOn}
              label="Country"
              name="country"
              placeholder="Select your country"
              inputContainerClassName="!bg-blackGrey-filled-input"
              value={values.country}
            />
          </div>

          {values.country && (
            <>
              <div className="mt-2">
                <h4 className="font-semibold text-p120">
                  Select Document Format
                </h4>
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
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
                <p className="text-red-error-dark text-caption mt-[4px] ml-4">
                  {errors.documentFormat}
                </p>
              )}
            </>
          )}

          <div className="mt-8"></div>

          {values.document.back && values.document.front && (
            <h4 className="text-black-100 font-semibold text-p120">Images</h4>
          )}

          {values.documentFormat && (
            <>
              <div className="flex gap-6 flex-wrap">
                <div className="mb-2">
                  {!values.document.front ? (
                    <>
                      <p className="my-2 font-semibold text-input text-black-100">
                        Choose Front Side
                      </p>
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
                          className="border min-w-[470px] justify-center border-light-gray border-dashed bg-blackGrey-filled-input p-3 px-8 rounded-full flex items-center gap-2"
                          onClick={() => front?.current?.click()}
                        >
                          <Add className="text-purple-500" />
                          <span className="text-blackGrey-placeholder text-input">
                            {" "}
                            Drop Files Here Or Click To Upload{" "}
                          </span>
                        </button>
                        <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                          {values.document?.front?.name}
                        </span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={getUrlOrObjectUrl(values.document.front)}
                      alt="front side"
                      className="w-[320px] max-w-full"
                    />
                  )}
                </div>

                <div>
                  {!values.document.back ? (
                    <>
                      <p className="my-2 font-semibold text-input text-black-100">
                        Choose Back Side
                      </p>
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
                          className="border min-w-[470px] justify-center border-light-gray border-dashed bg-blackGrey-filled-input p-3 px-8 rounded-full flex items-center gap-2"
                          onClick={() => back?.current?.click()}
                        >
                          <Add className="text-purple-500" />
                          <span className="text-blackGrey-placeholder text-input">
                            {" "}
                            Drop Files Here Or Click To Upload{" "}
                          </span>
                        </button>
                        <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                          {values.document?.back?.name}
                        </span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={getUrlOrObjectUrl(values.document.back)}
                      alt="bak side"
                      className="w-[320px] max-w-full"
                    />
                  )}
                </div>
              </div>
              {(values?.document?.front || values?.document?.back) && (
                <div className="mt-4 max-w-[220px]">
                  <LoaderButton
                    content={"Clear Images"}
                    variant={"outlined"}
                    onClick={clearImagesHandler}
                  />
                </div>
              )}

              {errors.document && (
                <p className="text-red-error-dark text-caption mt-[4px] ml-4">
                  {errors.document}
                </p>
              )}
            </>
          )}

          <p className="text-black-100">
            Please ensure your provided details are correct. Once your details
            are submitted for KYC approval they will be locked.
          </p>

          <ErrorApiText error={isSubmitKYCError} />

          <div className="mt-8 max-w-[360px]">
            <LoaderButton
              loading={isSubmitKYCLoading}
              content={"Continue"}
              type="submit"
              variant={"contained"}
            />
          </div>
        </LoadingApi>
      </div>
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
      className={`p-5 items-center max-w-full w-[360px] flex gap-4 rounded-[14px] shadow-md border cursor-pointer transition-all ${
        value == format
          ? `text-purple-500 border-purple-100`
          : "#AFAFAF  border-light-gray"
      }`}
    >
      <div className="p-1">
        <DocumentFormat
          fill={value == format ? "rgba(119, 53, 227, 1)" : "#AFAFAF"}
        />
      </div>
      <div className="name flex flex-col gap-0">
        <span className="font-semibold">{name}</span>
        <span>Front & Back</span>
      </div>
    </div>
  );
};
