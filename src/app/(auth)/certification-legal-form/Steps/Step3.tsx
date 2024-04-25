import FileHiddenButton from "@/components/common/FileHiddenButton";
import FormSection from "@/components/common/FormSection";
import RadioButton from "@/components/common/RadioButton";
import SelectBox from "@/components/common/SelectBox";
import { TextField } from "@mui/material";
import React from "react";

const Step3 = ({ errors, handleChange, validateField, values }) => {
  return (
    <>
      <FormSection
        heading={
          "3.1 Please tick all that apply regarding applicant business activities that represents 10% or more of annual turnover*"
        }
        childWrapperClass={"flex flex-col gap-1"}
        error={errors?.data}
      >
        <RadioButton
          label={"Managing or trading crypto assets"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Managing or trading regulated financial products"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Non crypto asset trading firms (non financial products)"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Wealth management (regulated firm)"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Commodity business (non crypto asset)"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Crypto asset mining"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Blockchain company"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Payments or financial technology (Fintech) company"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Crypto asset exchange or trading platform"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Crypto asset custodian"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Other"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>

      <FormSection
        heading={"3.2 Origin of company funds (click all that apply)*"}
        childWrapperClass={"flex flex-col gap-1"}
        error={errors?.data}
      >
        <RadioButton
          label={"Company or asset sale proceeds"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Business income proceeds"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Inherited wealth (incl family office)"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Investment, arranging or trading income proceeds"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"ICO, STO or other similar crypto asset offering"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Mining activities"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Investment fund"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Bank arranged debt facilities"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Other"}
          name={"Managing or trading crypto assets"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          type="checkbox"
          selctedValue={values?.value}
        />
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>

      <FormSection
        heading={
          "3.2. [Addendum] Please provide more detail (incl links to press releases if applicable)"
        }
      >
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>

      <FormSection
        heading={
          "3.2. [Addendum] How sizeable were proceeds from transaction?*"
        }
        childWrapperClass={"flex flex-col gap-1"}
      >
        <RadioButton
          label={"Less than US$100K"}
          name={"sizeableProceesTransaction"}
          value={"Less than US$100K"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Between US$100K-US$500K"}
          name={"sizeableProceesTransaction"}
          value={"Between US$100K-US$500K"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Between US$500K-US$1m"}
          name={"sizeableProceesTransaction"}
          value={"Between US$500K-US$1m"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Between US$1m-US$5m"}
          name={"sizeableProceesTransaction"}
          value={"Between US$1m-US$5m"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Between US$5m-US$20m"}
          name={"sizeableProceesTransaction"}
          value={"Between US$5m-US$20m"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Larger than US$20m"}
          name={"sizeableProceesTransaction"}
          value={"Larger than US$20m"}
          onChange={handleChange}
          type="radio"
          selctedValue={values?.value}
        />
      </FormSection>
      <FormSection
        heading={
          "3.2. [Addendum] Please upload any additional relevant information here"
        }
      >
        <FileHiddenButton
          name={"additionalRelevantInfo"}
          onChange={handleChange}
          // ref={passport}
          value={values?.passport}
        />
      </FormSection>
      <FormSection
        heading={
          "3.2. [Addendum] Please upload a company brochure or presentation"
        }
      >
        <FileHiddenButton
          name={"additionalRelevantInfo"}
          onChange={handleChange}
          // ref={passport}
          value={values?.passport}
        />
      </FormSection>
      <FormSection heading={"3.2. [Addendum] Entity website*"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.2. [Addendum] Name of investment fund*"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.2. [Addendum] Bank name*"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.2. [Addendum] Bank's country of incorporation*"}>
        <SelectBox
          placeholder="Country*"
          options={[{ value: "hello", label: "label" }]}
          name={"country"}
          onBlur={validateField}
          onChange={handleChange}
          value={values?.country}
        />
      </FormSection>
      <FormSection
        heading={"3.2. [Addendum] Size of debt facilities arranged *"}
      >
        <TextField
          className="input-field"
          type="number"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>

      <FormSection heading={"3.3.1. Last fiscal year turnover (US$)*"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.3.2. Last fiscal year net profit (US$)*"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection
        heading={
          "3.3.3. Last reported net assets or book value of equity (US$)*"
        }
      >
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection
        heading={
          " 3.3.4. Last reported assets, assets under management or similar (US$)*"
        }
      >
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.4. Number of employees *"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
      <FormSection heading={"3.5. Other supporting or relevant information"}>
        <TextField
          className="input-field"
          type="text"
          fullWidth
          value={values.addressline1}
          onChange={handleChange}
          onBlur={validateField}
          name="other"
        />
      </FormSection>
    </>
  );
};

export default Step3;
