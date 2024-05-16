"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import countryList from "react-select-country-list";

import { LinearProgress } from "@mui/material";

import useFormValidation from "@/hooks/useFormValidation";

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
} from "@/models/CertificationForm";
import { Step1, Step2, Step3, Step4 } from "./Steps";

import "../auth.scss";

const CertificationIndividualForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(2);

  const countries = useMemo(() => {
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

  const initialValues = {
    entityName: "",
    tradingName: "",
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    postal: "",
    incorporationCountry: "",
    incorporationDate: "",
    websiteUrl: "",
    registeredPhone: "",
    relationshipNature: {
      trading: "",
      custodyAssets: "",
      transactionsArrangement: "",
    },
    businessWithOFAC: "",
    OFACandNature: "", // -----> Available only when businessWithOFAC is TRUE
    legalEntityCompanyType: {
      regulated: "",
      stateOwned: "",
      listed: "",
      none: "",
    },
    nameCompanyTypePlace: "", // -----> Available only when legalEntityCompanyType has either one of three option is selected
    bondPrice: "",
    largestCrypto: "",
    saferReturn: "",
    monitoring: "",
    makeCryptoMoney: "",
    returnValue: "",
    riskTolerance: "",
    previousInvestments: {
      advisor: "",
      derivatives: "",
      bonds: "",
      equities: "",
      commodities: "",
      assets: "",
    },
  };

  const currentSchema =
    step == 1 ? Step1Schema : step == 2 ? Step2Schema : Step3Schema;

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, currentSchema);
 

  const onSubmit = () => {
    if (step != 3) {
      return handleNext();
    }
    router.push("/main");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 100);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  return (
    <section className="max-w-[728px]  mx-auto">
      <h3 className="font-semibold text-3xl">
        {step == 1 && "Section 1 - Information on the Legal Entity (1/2)"}
        {step == 2 && "Section 1 - Information on the Legal Entity (2/2)"}
        {step == 3 && "Section 3 - Alphaspay Financial Sophistication Test"}
        {step == 4 &&
          "Section 3 - Financial Experience and Risk Tolerance of the Legal Entity"}
      </h3>
      <form
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
        className="mt-12"
      >
        {step == 1 && (
          <Step1
            countries={countries}
            errors={errors}
            handleChange={handleChange}
            validateField={validateField}
            values={values}
          />
        )}

        {step == 2 && (
          <Step2
            errors={errors}
            handleChange={handleChange}
            validateField={validateField}
            values={values}
          />
        )}
        {step == 3 && (
          <Step3
            errors={errors}
            handleChange={handleChange}
            validateField={validateField}
            values={values}
          />
        )}

        {step == 4 && (
          <Step4
            errors={errors}
            handleChange={handleChange}
            validateField={validateField}
            values={values}
          />
        )}

        <div className="actions">
          <div className="flex justify-between gap-4">
            {step != 1 && (
              <button
                className="btn-secondary"
                onClick={handlePrev}
                type="button"
              >
                Previous
              </button>
            )}
            {step != 3 && (
              <button className="btn-secondary ms-auto" type="submit">
                Next
              </button>
            )}
            {step == 3 && (
              <button className="btn-secondary" type="submit">
                Submit Form
              </button>
            )}
          </div>
          <div>
            <LinearProgress
              value={(step / 4) * 100}
              variant="determinate"
              className="h-5 mt-6 rounded-sm"
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default CertificationIndividualForm;
