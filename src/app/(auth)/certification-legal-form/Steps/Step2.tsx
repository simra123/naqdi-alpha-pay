import React from "react";

import { TextField } from "@mui/material";
import FormSection from "@/components/common/FormSection";
import RadioButton from "@/components/common/RadioButton";
import FileHiddenButton from "@/components/common/FileHiddenButton";

const Step2 = ({ values, errors, handleChange, validateField }) => {
  return (
    <>
      <FormSection
        heading={`  1.9. Is the parent company a regulated or listed or state-owned
          company?*`}
        childWrapperClass={`flex flex-col gap-2`}
      >
        <RadioButton
          label={`Regulated`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
        <RadioButton
          label={`State owned`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value="true"
          name="previousInvestments.bonds"
          selctedValue={values?.bonds}
          onChange={handleChange}
        />
        <RadioButton
          label={`Listed`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
        <RadioButton
          label={`None of the above`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection
        heading={`   1.8.1. If yes, please state the name of the regulator or listing
            exchange or State.*`}
      >
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

      <FormSection
        heading={`  1.8. Is the Legal Entity a regulated or listed or state-owned
          company?*`}
        childWrapperClass={`flex flex-col gap-2`}
      >
        <RadioButton
          label={`Regulated`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
        <RadioButton
          label={`State owned`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value="true"
          name="previousInvestments.bonds"
          selctedValue={values?.bonds}
          onChange={handleChange}
        />
        <RadioButton
          label={`Listed`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
        <RadioButton
          label={`None of the above`}
          type="checkbox"
          className="form-checkbox h-5 w-5"
          value={true}
          name="previousInvestments.derivatives"
          selctedValue={values?.derivatives}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection
        heading={`   1.9.1. If yes, please state the name of the regulator or listing
          exchange or State.*`}
      >
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

      <FormSection
        heading={`   1.10. Please describe the main business activity of your Legal
          Entity*`}
      >
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

      <FormSection
        heading={`   1.10. Please describe the main business activity of your Legal
          Entity*`}
      >
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

      <FormSection heading={`1.11. Name of external auditor (if any)`}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>

      <FormSection
        heading={`1.12. Type of Legal Entity*`}
        childWrapperClass={"flex flex-col gap-2"}
      >
        <RadioButton
          type="radio"
          value={"Private, Unregulated Company or Partnership"}
          name="riskTolerance"
          selctedValue={
            values?.riskTolerance ===
            "Private, Unregulated Company or Partnership"
          }
          onChange={handleChange}
          label={` Private, Unregulated Company or Partnership`}
        />
        <RadioButton
          type="radio"
          value={"Public Company (Listed or Unlisted)"}
          name="riskTolerance"
          selctedValue={
            values?.riskTolerance === "Public Company (Listed or Unlisted)"
          }
          onChange={handleChange}
          label={`Public Company (Listed or Unlisted)`}
        />
        <RadioButton
          type="radio"
          value={"Trusts, clubs, associations, NGOs or charitable institutions"}
          name="riskTolerance"
          selctedValue={
            values?.riskTolerance ===
            "Trusts, clubs, associations, NGOs or charitable institutions"
          }
          onChange={handleChange}
          label={`Trusts, clubs, associations, NGOs or charitable institutions`}
        />
        <RadioButton
          type="radio"
          value={"Trusts, clubs, associations, NGOs or charitable institutions"}
          name="riskTolerance"
          selctedValue={
            values?.riskTolerance ===
            "Trusts, clubs, associations, NGOs or charitable institutions"
          }
          onChange={handleChange}
          label={`Trusts, clubs, associations, NGOs or charitable institutions`}
        />
        <RadioButton
          type="radio"
          value={"Government or sovereign entity"}
          name="riskTolerance"
          selctedValue={values?.riskTolerance === "Government or sovereign entity"}
          onChange={handleChange}
          label={`Government or sovereign entity`}
        />
        <RadioButton
          type="radio"
          value={"Sole proprietorship"}
          name="riskTolerance"
          selctedValue={values?.riskTolerance === "Sole proprietorship"}
          onChange={handleChange}
          label={`Sole proprietorship`}
        />
        <RadioButton
          type="radio"
          value={"other"}
          name="riskTolerance"
          selctedValue={values?.riskTolerance === "other"}
          onChange={handleChange}
          label={`Other`}
        />
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>

      <FormSection heading={`1.12. [Addendum] Proof of listing*`}>
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>

      <FormSection heading={`1.12. [Addendum] Proof of regulation*`}>
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={` 1.12. [Addendum] Memorandum and Articles of Association or By-Laws or
        Partnership Agreement or Trust Deed or equivalent*`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={`  1.12. [Addendum] Law Establishing the government entity or evidence of
        its establishment*`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={`1.12. [Addendum] Audited Financial Accounts or Annual Report or if
        unavailable, Management Financial Statements or Forecasts *`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={`1.12. [Addendum] Certificate of Incorporation or Registration
        Certificate or Commercial Licence or Trade License or equivalent*`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={`1.12. Proof of Address (Utility Bill, Lease Agreement, Commercial
          Licence etc)*`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={`1.12. Proof of Address (Utility Bill, Lease Agreement, Commercial
          Licence etc)*`}
      >
        <FileHiddenButton
          name={"values"}
          onChange={handleChange}
          value={values?.val}
          // ref
        />
      </FormSection>
      <FormSection
        heading={` 1.13. How many Directors does the Legal Entity have? *`}
      >
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values?.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="addressline1"
        />
      </FormSection>
      <FormSection
        heading={`1.14. Does any individual Shareholder hold 20% or more of the equity
        of the Legal Entity? *`}
        childWrapperClass={"flex flex-col gap-2"}
      >
        <RadioButton
          name="advisor"
          value={true}
          onChange={handleChange}
          label={"Yes"}
          selctedValue={values?.val}
        />
        <RadioButton
          name="advisor"
          value={false}
          onChange={handleChange}
          label={"No"}
          selctedValue={values?.val}
        />
        <p className="note">
          If yes, our onboarding team will be in touch via email with identity
          requirements needed from these Shareholder(s)
        </p>
      </FormSection>

      <FormSection
        heading={`1.15. Are there any Shareholders of the Legal Entity that are
          themselves Legal Entities? *`}
        childWrapperClass={"flex flex-col gap-2"}
      >
        <RadioButton
          name="advisor"
          value={true}
          onChange={handleChange}
          label={"Yes"}
          selctedValue={values?.val}
        />
        <RadioButton
          name="advisor"
          value={false}
          onChange={handleChange}
          label={"No"}
          selctedValue={values?.val}
        />
        <p className="note">
          If yes, our onboarding team will be in touch via email with Ultimate
          Beneficial Owner information requirements
        </p>
      </FormSection>
      <FormSection
        heading={` 1.16. Is the User trading on behalf of the Legal Entity, a Director of
        the Legal Entity?*`}
        childWrapperClass={"flex flex-col gap-2"}
      >
        <RadioButton
          name="advisor"
          value={true}
          onChange={handleChange}
          label={"Yes"}
          selctedValue={values?.val}
        />
        <RadioButton
          name="advisor"
          value={false}
          onChange={handleChange}
          label={"No"}
          selctedValue={values?.val}
        />
        <p className="note">
          If no, our onboarding team will be in touch via email with Authorised
          Representative information requirements
        </p>
      </FormSection>
    </>
  );
};

export default Step2;
