import React from "react";

import FormSection from "@/components/common/FormSection";
import RadioButton from "@/components/common/RadioButton";
import FormRadioTable from "@/components/common/FormRadioTable";
import { TextField } from "@mui/material";

const Step4 = ({ errors, handleChange, validateField, values }) => {
  return (
    <>
      <FormSection
        heading={
          "5.1 Please select the degree of risk that is to be taken with the assets in this account. *"
        }
        childWrapperClass={"flex flex-col gap-1"}
        error={errors?.data}
      >
        <RadioButton
          label={"Conservative"}
          name={"accountAssetRisk"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Moderately Conservative"}
          name={"accountAssetRisk"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Moderate"}
          name={"accountAssetRisk"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Moderately Aggressive"}
          name={"accountAssetRisk"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          selctedValue={values?.value}
        />
        <RadioButton
          label={"Aggressive"}
          name={"accountAssetRisk"}
          value={"Managing or trading crypto assets"}
          onChange={handleChange}
          selctedValue={values?.value}
        />

        <p className="note mt-2">
          Conservative. Preserve initial principal in this account, with minimal
          risk, even if that means this account does not generate significant
          income or returns and may not keep pace with inflation. Moderately
          Conservative. Accept low risk to initial principal, including low
          volatility, to seek a modest level of port¬folio returns. Moderate.
          Accept some risk to initial principal and tolerate some volatility to
          seek higher returns, and understand it could lose a portion of the
          money invested. Moderately Aggressive. Accept high risk to initial
          principal, including high volatility, to seek high returns over time,
          and understand it could lose a substantial amount of the money
          invested. Aggresive. Accept maximum risk to initial principal to
          aggressively seek maximum returns, and understand it could lose most,
          or all, of the money invested.
        </p>
      </FormSection>

      <FormSection heading={"5.2 Years of Experience of Decision Maker*"}>
        <div>
          <FormRadioTable
            items={["", "Less than 1 year", "1 - 5 years", "Over 5 years"]}
          />
          <FormRadioTable
            items={[
              "Crypto Assets",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Mutual Funds / ETFs",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Individual Stocks",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Bonds",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Options",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Securities Futures",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Annuities",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Margin",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
          <FormRadioTable
            items={[
              "Other (Please describe below)",
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
              <RadioButton
                label={"label"}
                name={"accountAssetRisk"}
                value={"Managing or trading crypto assets"}
                onChange={handleChange}
                selctedValue={values?.value}
              />,
            ]}
          />
        </div>
        <p className="note">
          We are collecting information to better understand investment
          experience. We recognize responses may change over time.
        </p>
      </FormSection>
      <FormSection heading={"5.3 Average Trading Transactions per year "}>
        <FormRadioTable
          items={["", "Less than 1 year", "1 - 5 years", "Over 5 years"]}
        />
        <FormRadioTable
          items={[
            "Crypto Assets",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Mutual Funds / ETFs",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Individual Stocks",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Bonds",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Options",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Securities Futures",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Annuities",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Margin",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />
        <FormRadioTable
          items={[
            "Other (Please describe below)",
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
            <RadioButton
              label={"label"}
              name={"accountAssetRisk"}
              value={"Managing or trading crypto assets"}
              onChange={handleChange}
              selctedValue={values?.value}
            />,
          ]}
        />

        <p className="note mt-2">
          We are collecting information to better understand investment
          experience. We recognize responses may change over time.
        </p>
      </FormSection>

      <FormSection heading={"5.4 Other Relevant Information"}>
        <TextField
          className="input-field"
          placeholder="First Name*"
          type="text"
          fullWidth
          value={values?.firstName}
          onChange={handleChange}
          onBlur={validateField}
          name="firstName"
        />

        <p className="note mt-2">
          Please provide us with any additional information that you believe
          will help us more fully understand your investment needs, objectives,
          financial situation, risk attitude and experience.
        </p>
      </FormSection>
    </>
  );
};

export default Step4;
