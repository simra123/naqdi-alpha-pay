"use client";

import React, { useMemo, useRef } from "react";
import { Typography } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import countryList from "react-select-country-list";
import useFormValidation from "@/hooks/useFormValidation";
import { IDENTITY_FORMATS } from "@/constants/onboarding";
import { IdentityCheckSchema } from "@/models/IdentityCheck";

const IdentityCheck = () => {
  const front = useRef(null);
  const back = useRef(null);
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

  const initialValues = {
    country: "",
    documentFormat: "",
    document: {
      front: null,
      back: null,
    },
  };

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, IdentityCheckSchema);

  console.log(values);

  const onSubmit = () => {
    // Your submission logic here

    alert("Form submitted successfully!");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 500);
    console.log("Form Not submitted successfully!");
  };

  const handleFormatChange = (format) => () => {
    setValues((pre) => ({ ...pre, documentFormat: format }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}>
      <h2 className="large_heading_bold">Know Your Customer Identity Check</h2>
      <p>
        Please fill in the details so we can proceed with you Identity
        Confirmation
      </p>

      <div className="register_form__trader">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
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
          {errors.country && <div className="error_text">{errors.country}</div>}
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
            <img
              src={URL.createObjectURL(values.document.front)}
              alt="front side"
              className="min-w-full"
            />
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
            <img
              src={URL.createObjectURL(values.document.back)}
              alt="bak side"
              className="min-w-full"
            />
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
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl" type="submit">
          Save & Next
        </button>
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
      className={`card p-5 items-center flex gap-6 bg-white shadow-md border cursor-pointer transition-all ${
        value == format
          ? `bg-slate-500 !text-white`
          : `hover:bg-slate-100 hover:text-gray-950`
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
