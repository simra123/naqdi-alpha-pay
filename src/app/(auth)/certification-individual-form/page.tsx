"use client";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import useFormValidation from "@/hooks/useFormValidation";
import { useMemo, useRef, useState } from "react";
import SelectBox from "@/components/common/SelectBox";
import countryList from "react-select-country-list";
import { LinearProgress } from "@mui/material";
import "../auth.scss";
import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
} from "@/models/CertificationForm";
import { Step1, Step2, Step3 } from "./Steps";

const CertificationIndividualForm = () => {
  const router = useRouter();
  const passport = useRef(null);
  const address = useRef(null);
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
  const [step, setStep] = useState(1);

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    passport: "",
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    addressProof: "",
    annualIncomeSource: "",
    previousInvestments: {
      advisor: "",
      derivatives: "",
      bonds: "",
      equities: "",
      commodities: "",
      assets: "",
    },
    usedElecPlatform: "",
    safestInvestment: "",
    governementBond: "",
    companyStock: "",
    bondPrice: "",
    largestCrypto: "",
    saferReturn: "",
    monitoring: "",
    makeCryptoMoney: "",
    returnValue: "",
    riskTolerance: "",
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
        {step == 1 && "Section 1. Client Details"}
        {step == 2 && "Section 2. Source of Wealth and Origin of Funds"}
        {step == 3 && "Section 3. Alphaspay Financial Sophistication Test"}
      </h3>
      <form
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
        className="mt-12"
      >
        {step == 1 && (
          <Step1
            countries={options}
            errors={errors}
            handleChange={handleChange}
            validateField={validateField}
            values={values}
          />
        )}

        {step == 2 && (
          <Step2
            errors={errors}
            validateField={validateField}
            values={values}
            handleChange={handleChange}
          />
        )}
        {step == 3 && (
          <Step3
            errors={errors}
            validateField={validateField}
            values={values}
            handleChange={handleChange}
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
              value={(step / 3) * 100}
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
