import React, { useRef } from "react";

import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SelectBox from "@/components/common/SelectBox";
import FormSection from "@/components/common/FormSection";
import RadioButton from "@/components/common/RadioButton/LabelRadioButton";

const Step1 = ({ values, handleChange, validateField, errors, countries }) => {
  const addressProofRef = useRef();
  const passportRef = useRef();
  return (
    <div>
      <FormSection heading={`1.1. Registered name of Legal Entity*`}>
        <TextField
          className="input-field"
          placeholder="Registered Name*"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>
      <FormSection heading={`1.2. Trading name*`}>
        <TextField
          className="input-field"
          placeholder="Trading Name*"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>

      <FormSection
        heading={`1.3. Residential Address*`}
        childWrapperClass="flex flex-col gap-4"
      >
        <div>
          <TextField
            className="input-field"
            placeholder="Address Line 1*"
            type="text"
            fullWidth
            value={values?.addressline1}
            onChange={handleChange}
            onBlur={validateField}
            name="addressline1"
          />
          {errors?.addressline1 && (
            <div className="error_text">{errors?.addressline1}</div>
          )}
        </div>
        <div>
          <TextField
            className="input-field"
            placeholder="Address Line 2*"
            type="text"
            fullWidth
            value={values?.addressline2}
            onChange={handleChange}
            onBlur={validateField}
            name="addressline2"
          />
          {errors?.addressline2 && (
            <div className="error_text">{errors?.addressline2}</div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <TextField
              className="input-field"
              placeholder="City*"
              type="text"
              fullWidth
              value={values?.city}
              onChange={handleChange}
              onBlur={validateField}
              name="city"
            />
            {errors?.city && <div className="error_text">{errors?.city}</div>}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="State/Province*"
              type="text"
              fullWidth
              value={values?.state}
              onChange={handleChange}
              onBlur={validateField}
              name="state"
            />
            {errors?.state && <div className="error_text">{errors?.state}</div>}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="ZIP / Postal*"
              type="text"
              fullWidth
              value={values?.postal}
              onChange={handleChange}
              onBlur={validateField}
              name="postal"
            />
            {errors?.postal && (
              <div className="error_text">{errors?.postal}</div>
            )}
          </div>
        </div>
        <div>
          <SelectBox
            placeholder="Country Of Incorporation*"
            options={countries}
            name={"country"}
            onBlur={validateField}
            onChange={handleChange}
            value={values?.country}
          />
          {errors?.country && (
            <div className="error_text">{errors?.country}</div>
          )}
        </div>
      </FormSection>

      <FormSection heading={`1.4. Date of incorporation*`}>
        <DatePicker
          className="input-field w-full"
          onChange={(value) =>
            handleChange({
              target: { name: "incorporateDate", value },
            })
          }
        />
      </FormSection>
      <FormSection heading={`1.5. Website URL*`}>
        <TextField
          className="input-field"
          placeholder="URL*"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>
      <FormSection heading={`1.6. Registered phone number*`}>
        <TextField
          className="input-field"
          placeholder="URL*"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>
      <FormSection
        heading={` 1.7. Nature of relationship with Alphaspay (click all that apply)*`}
        childWrapperClass={`flex flex-col gap-2`}
      >
        <RadioButton
          type="checkbox"
          label={`Trading through Alphaspay`}
          value={true}
          selctedValue={values?.value}
          name="previousInvestments.derivatives"
          onChange={handleChange}
        />
        <RadioButton
          type="checkbox"
          label={`Custody assets on Alphaspay`}
          value={true}
          selctedValue={values?.value}
          name="previousInvestments.derivatives"
          onChange={handleChange}
        />
        <RadioButton
          selctedValue={values?.value}
          type="checkbox"
          label={` Arranging transactions in virtual assets on behalf of others
          on the Alphaspay platform`}
          value={true}
          name="previousInvestments.derivatives"
          onChange={handleChange}
        />
      </FormSection>

      <FormSection
        heading={`  1.8. Does your company conduct any business with any OFAC sanctioned
          countries? If yes, kindly disclose the country and nature of
          business.*`}
        childWrapperClass={`flex flex-col gap-2`}
      >
        <RadioButton
          type="radio"
          name="advisor"
          value={true}
          onChange={handleChange}
          selctedValue={values?.selected}
          label={"Yes"}
        />
        <RadioButton
          type="radio"
          name="advisor"
          value={true}
          onChange={handleChange}
          selctedValue={values?.selected}
          label={"No"}
        />
      </FormSection>

      <FormSection heading={`1.8.1 Country and Nature of Business*`}>
        <TextField
          className="input-field"
          placeholder="Details*"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>
    </div>
  );
};

export default Step1;
