import FileHiddenButton from "@/components/common/FileHiddenButton";
import FormSection from "@/components/common/FormSection";
import SelectBox from "@/components/common/SelectBox";
import { TextField } from "@mui/material";
import React, { useRef } from "react";

const Step1 = ({ values, errors, handleChange, validateField, countries }) => {
  const addressProofRef = useRef();
  const passportRef = useRef();
  return (
    <>
      <FormSection heading={`1.1. Name*`}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <TextField
              className="input-field"
              placeholder="First Name*"
              type="text"
              fullWidth
              value={values.firstName}
              onChange={handleChange}
              onBlur={validateField}
              name="firstName"
            />

            {errors.firstName && (
              <div className="error_text">{errors?.firstName}</div>
            )}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="Middle Name"
              type="text"
              fullWidth
              value={values.middleName}
              onChange={handleChange}
              onBlur={validateField}
              name="middleName"
            />
            {errors.middleName && (
              <div className="error_text">{errors?.middleName}</div>
            )}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="Last Name*"
              type="text"
              fullWidth
              value={values.lastName}
              onChange={handleChange}
              onBlur={validateField}
              name="lastName"
            />
            {errors.lastName && (
              <div className="error_text">{errors?.lastName}</div>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        heading={`1.2. Upload biometric page of your Passport*`}
        error={errors.passport}
      >
        <FileHiddenButton
          name="passport"
          onChange={handleChange}
          value={values.passport}
          ref={passportRef}
        />
        <p className="note mt-3">
          This document can be either from your country of residence or your
          country of citizenship
        </p>
      </FormSection>

      <FormSection
        heading={`1.3. Current Residential Address*`}
        childWrapperClass={`flex flex-col gap-4`}
      >
        <div>
          <TextField
            className="input-field"
            placeholder="Address Line 1*"
            type="text"
            fullWidth
            value={values.addressline1}
            onChange={handleChange}
            onBlur={validateField}
            name="addressline1"
          />
          {errors.addressline1 && (
            <div className="error_text">{errors?.addressline1}</div>
          )}
        </div>
        <div>
          <TextField
            className="input-field"
            placeholder="Address Line 2*"
            type="text"
            fullWidth
            value={values.addressline2}
            onChange={handleChange}
            onBlur={validateField}
            name="addressline2"
          />
          {errors.addressline2 && (
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
              value={values.city}
              onChange={handleChange}
              onBlur={validateField}
              name="city"
            />
            {errors.city && <div className="error_text">{errors?.city}</div>}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="State/Province*"
              type="text"
              fullWidth
              value={values.state}
              onChange={handleChange}
              onBlur={validateField}
              name="state"
            />
            {errors.state && <div className="error_text">{errors?.state}</div>}
          </div>
          <div>
            <TextField
              className="input-field"
              placeholder="ZIP / Postal*"
              type="text"
              fullWidth
              value={values.postal}
              onChange={handleChange}
              onBlur={validateField}
              name="postal"
            />
            {errors.postal && (
              <div className="error_text">{errors?.postal}</div>
            )}
          </div>
        </div>
        <div>
          <SelectBox
            placeholder="Country*"
            options={countries}
            name={"country"}
            onBlur={validateField}
            onChange={handleChange}
            value={values?.country}
          />
          {errors.country && (
            <div className="error_text">{errors?.country}</div>
          )}
        </div>
      </FormSection>

      <FormSection
        heading={`  1.4. Upload Proof of Address (not older than 3 months)*`}
        error={errors?.addressProof}
      >
        <FileHiddenButton
          name="addressProof"
          value={values.addressProof}
          onChange={handleChange}
          ref={addressProofRef}
        />
      </FormSection>
      <p className="note mt-3">
        We are required to verify our Client’s identity together with a proof of
        address. These basic mandatory KYC documents are necessary to comply
        with local and global regulations and to establish your identity at the
        time of creating an account on Alphaspay. All of the following documents
        must demonstrate both the identical name and identical address
        registered on the Alphaspay platform.
      </p>

      <div className="list_docs mt-5">
        <h5 className="mb-4 font-bold">
          Documents that can be submitted as proof of address
        </h5>
        <ul className="list-disc text-justify ms-5 leading-5">
          <li>
            Utility bill linked to the residential property, such as gas,
            electricity, water, internet, landline telephone not older than 3
            months;
          </li>
          <li>Credit card statement not older than 3 months;</li>
          <li>
            Letter from any recognized public authority or public servant, any
            government issued correspondence not older than 3 months;
          </li>
          <li>Lease agreement along with last 3 months rent receipt; or</li>
          <li>House purchase deed not older than 3 months.</li>
        </ul>
      </div>
    </>
  );
};

export default Step1;
