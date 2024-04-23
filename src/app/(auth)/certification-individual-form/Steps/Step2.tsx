import React from "react";
import { TextField } from "@mui/material";
import FormSection from "@/components/common/FormSection";

const Step2 = ({ values, errors, handleChange, validateField }) => {
  return (
    <>
      <p className="note text-justify !text-[14px] mb-8">
        At Alphaspay we require that our clients have Net Assets of at least USD
        500,000, excluding the value of their primary residence, at the time of
        registration. These measures are part of our Anti-Money Laundering and
        Know Your Client policies necessary for every type of business involving
        money transactions. Compliance with regulations prevents frauds from
        inflicting damage on us and on you and your financial assets. This is
        one of the multiple mandatory requirements required before carrying out
        any transactions and is closely observed by jurisdictional regulators.
      </p>

      <FormSection
        heading={`2.1. What is the main source of your annual income? *`}
        error={errors.annualIncomeSource}
      >
        <TextField
          className="input-field"
          placeholder="Annual Income Source*"
          type="text"
          fullWidth
          value={values.annualIncomeSource}
          onChange={handleChange}
          onBlur={validateField}
          name="annualIncomeSource"
        />
      </FormSection>
    </>
  );
};

export default Step2;
