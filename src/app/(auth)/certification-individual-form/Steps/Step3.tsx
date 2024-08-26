import FormSection from "@/components/common/FormSection";
import RadioButton from "@/components/common/RadioButton/LabelRadioButton";
import React from "react";

const Step3 = ({ values, errors, validateField, handleChange }) => {
  return (
    <>
      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`3.1. Do you use an independent financial advisor / planner?*`}
        error={errors.advisor}
      >
        <RadioButton
          name="advisor"
          value={"true"}
          onChange={handleChange}
          label={`Yes`}
          selctedValue={values?.advisor}
        />
        <RadioButton
          value={"false"}
          name="advisor"
          onChange={handleChange}
          label={`No`}
          selctedValue={values?.advisor}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`3.2. Which of these products have you invested in previously?*`}
        error={errors.previousInvestments}
      >
        <RadioButton
          type="checkbox"
          value={"true"}
          name="previousInvestments.derivatives"
          onChange={handleChange}
          label={`Derivatives`}
          selctedValue={values?.previousInvestments?.derivatives}
        />
        <RadioButton
          type="checkbox"
          value="true"
          name="previousInvestments.bonds"
          onChange={handleChange}
          label={`Bonds`}
          selctedValue={values?.previousInvestments?.bonds}
        />
        <RadioButton
          type="checkbox"
          value={"true"}
          name="previousInvestments.equities"
          onChange={handleChange}
          label={`Equities`}
          selctedValue={values?.previousInvestments?.equities}
        />
        <RadioButton
          type="checkbox"
          value="true"
          name="previousInvestments.commodities"
          onChange={handleChange}
          label={`Commodities`}
          selctedValue={values?.previousInvestments?.commodities}
        />
        <RadioButton
          type="checkbox"
          value="true"
          name="previousInvestments.assets"
          onChange={handleChange}
          label={`Virtual / Crypto Assets`}
          selctedValue={values?.previousInvestments?.assets}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.3 Have you ever used an electronic platform to trade?*`}
        error={errors.usedElecPlatform}
      >
        <RadioButton
          value={"true"}
          name="usedElecPlatform"
          onChange={handleChange}
          label={"Yes"}
          selctedValue={values.usedElecPlatform}
        />
        <RadioButton
          value={"false"}
          name="usedElecPlatform"
          onChange={handleChange}
          label={"No"}
          selctedValue={values.usedElecPlatform}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`3.4 You should put all your money into the safest investment you can
          find and accept whatever returns it pays.*`}
        error={errors.safestInvestment}
      >
        <RadioButton
          value={"true"}
          name="safestInvestment"
          selctedValue={values.safestInvestment}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="safestInvestment"
          selctedValue={values.safestInvestment}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.5. Using a high interest credit card to buy a government bond is a
        good idea. *`}
        error={errors.governementBond}
      >
        <RadioButton
          value={"true"}
          name="governementBond"
          selctedValue={values.governementBond}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="governementBond"
          selctedValue={values.governementBond}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`3.6. An employee of a company with publicly traded stock should invest
        all of their retirement savings in the company’s stock. *`}
        error={errors.companyStock}
      >
        <RadioButton
          value={"true"}
          name="companyStock"
          selctedValue={values.companyStock}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="companyStock"
          selctedValue={values.companyStock}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>
      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.7. If interest rates rise, then bond prices will generally fall*`}
        error={errors.bondPrice}
      >
        <RadioButton
          value={"true"}
          name="bondPrice"
          selctedValue={values.bondPrice}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="bondPrice"
          selctedValue={values.bondPrice}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`  3.8. I understand the cryptocurrency market reasonably well and the
        largest cryptocurrency by market capitalization is Bitcoin*`}
        error={errors.largestCrypto}
      >
        <RadioButton
          value={"true"}
          name="largestCrypto"
          selctedValue={values.largestCrypto}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="largestCrypto"
          selctedValue={values.largestCrypto}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.9. Buying a single coin usually provides a safer return than a
        mutual fund or a diverse number of different coins*`}
        error={errors.saferReturn}
      >
        <RadioButton
          value={"true"}
          name="saferReturn"
          selctedValue={values.saferReturn}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="saferReturn"
          selctedValue={values.saferReturn}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.10. Cryptocurrency markets are volatile, and your account needs
        constant monitoring.*`}
        error={errors.monitoring}
      >
        <RadioButton
          value={"true"}
          name="monitoring"
          selctedValue={values.monitoring}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="monitoring"
          selctedValue={values.monitoring}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`  3.11. To make money in cryptocurrency markets, you have to buy and
        sell often.*`}
        error={errors.makeCryptoMoney}
      >
        <RadioButton
          value={"true"}
          name="makeCryptoMoney"
          selctedValue={values.makeCryptoMoney}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="makeCryptoMoney"
          selctedValue={values.makeCryptoMoney}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={` 3.12. Suppose you invested $100 in cryptocurrency and the appreciation
        was 2% per year. After five years, you would have $110 of
        cryptocurrency.*`}
        error={errors.returnValue}
      >
        <RadioButton
          value={"true"}
          name="returnValue"
          selctedValue={values.returnValue}
          onChange={handleChange}
          label={"Yes"}
        />
        <RadioButton
          value={"false"}
          name="returnValue"
          selctedValue={values.returnValue}
          onChange={handleChange}
          label={"No"}
        />
      </FormSection>

      <FormSection
        childWrapperClass={"flex flex-col gap-2"}
        heading={`3.13. Risk Tolerance of the Individual* `}
        error={errors.riskTolerance}
      >
        <RadioButton
          value={"Conservative"}
          name="riskTolerance"
          selctedValue={values.riskTolerance}
          onChange={handleChange}
          label={"Conservative"}
        />
        <RadioButton
          value={"Moderately Conservative"}
          name="riskTolerance"
          selctedValue={values.riskTolerance}
          onChange={handleChange}
          label={"Moderately Conservative"}
        />
        <RadioButton
          value={"Moderate"}
          name="riskTolerance"
          selctedValue={values.riskTolerance}
          onChange={handleChange}
          label={"Moderate"}
        />
        <RadioButton
          value={"Moderately Aggressive"}
          name="riskTolerance"
          selctedValue={values.riskTolerance}
          onChange={handleChange}
          label={"Moderately Aggresive"}
        />
        <RadioButton
          value={"Aggressive"}
          name="riskTolerance"
          selctedValue={values.riskTolerance}
          onChange={handleChange}
          label={"Aggresive"}
        />
      </FormSection>

      <div className="list_docs mt-5 mb-8">
        <h5 className="mb-4 font-bold">
          Please select the degree of risk that is to be taken with the assets
          in this account
        </h5>
        <ul className="list-disc text-justify ms-5 leading-5">
          <li>
            <span className="font-bold"> Conservative:</span> Preserve initial
            principal in this account, with minimal risk, even if that means his
            account does not generate significant income or returns and may not
            keep pace with inflation.
          </li>
          <li>
            <span className="font-bold"> Moderately Conservative:</span> Accept
            low risk to initial principal, including low volatility, to seek a
            modest level of portfolio returns.{" "}
          </li>
          <li>
            <span className="font-bold"> Moderate:</span> Accept some risk to
            initial principal and tolerate some volatility to seek higher
            returns, and understand it could lose a portion of the money
            invested.
          </li>
          <li>
            <span className="font-bold"> Moderately Aggressive:</span> Accept
            high risk to initial principal, including high volatility, to seek
            high returns over time, and understand it could lose a substantial
            amount of the money invested.
          </li>
          <li>
            <span className="font-bold"> Aggressive:</span> Accept maximum risk
            to initial principal to aggressively seek maximum returns, and
            understand it could lose most, or all, of the money invested.
          </li>
        </ul>
      </div>
    </>
  );
};

export default Step3;
