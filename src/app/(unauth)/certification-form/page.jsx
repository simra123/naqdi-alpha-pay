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

const CertificationFormPage = () => {
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
  console.log({ values, errors });

  const onSubmit = () => {
    if (step != 3) {
      return handleNext();
    }
    router.push("/main");
  };
  const onSubmitError = () => {
    window.scrollTo(0, 100);
    console.log("Form Not submitted successfully!");
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
        {step == 3 && "Section 3. HAYVN Financial Sophistication Test"}
      </h3>
      <form
        onSubmit={(e) => handleSubmit(e, onSubmit, onSubmitError)}
        className="mt-12"
      >
        {step == 1 && (
          <>
            <div className="form_section mb-8">
              <h5 className="mb-4">1.1. Name*</h5>
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
            </div>
            <div className="form_section mb-8">
              <h5 className="mb-4">
                1.2. Upload biometric page of your Passport*
              </h5>

              <input
                type="file"
                name="passport"
                onBlur={validateField}
                onChange={handleChange}
                ref={passport}
                hidden
              />
              <div className="flex gap-6 items-center">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => passport?.current?.click()}
                >
                  Choose File
                </button>
                <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                  {values.passport?.name}
                </span>
              </div>

              {errors.passport && (
                <div className="error_text">{errors?.passport}</div>
              )}

              <p className="note mt-3">
                This document can be either from your country of residence or
                your country of citizenship
              </p>
            </div>
            <div className="form_section mb-8">
              <h5 className="mb-4">1.3. Current Residential Address*</h5>
              <div className="flex flex-col gap-4">
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
                    {errors.city && (
                      <div className="error_text">{errors?.city}</div>
                    )}
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
                    {errors.state && (
                      <div className="error_text">{errors?.state}</div>
                    )}
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
                    options={options}
                    name={"country"}
                    onBlur={validateField}
                    onChange={handleChange}
                    value={values?.country}
                  />
                  {errors.country && (
                    <div className="error_text">{errors?.country}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form_section mb-8">
              <h5 className="mb-4">
                1.4. Upload Proof of Address (not older than 3 months)*
              </h5>

              <input
                type="file"
                name="addressProof"
                onBlur={validateField}
                onChange={handleChange}
                hidden
                ref={address}
              />

              <div className="flex gap-6 items-center">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => address?.current?.click()}
                >
                  Choose File
                </button>
                <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
                  {values.addressProof?.name}
                </span>
              </div>

              {errors.addressProof && (
                <div className="error_text">{errors?.addressProof}</div>
              )}
              <p className="note mt-3">
                We are required to verify our Client’s identity together with a
                proof of address. These basic mandatory KYC documents are
                necessary to comply with local and global regulations and to
                establish your identity at the time of creating an account on
                Alphaspay. All of the following documents must demonstrate both
                the identical name and identical address registered on the
                Alphaspay platform.
              </p>

              <div className="list_docs mt-5">
                <h5 className="mb-4 font-bold">
                  Documents that can be submitted as proof of address
                </h5>
                <ul className="list-disc text-justify ms-5 leading-5">
                  <li>
                    Utility bill linked to the residential property, such as
                    gas, electricity, water, internet, landline telephone not
                    older than 3 months;
                  </li>
                  <li>Credit card statement not older than 3 months;</li>
                  <li>
                    Letter from any recognized public authority or public
                    servant, any government issued correspondence not older than
                    3 months;
                  </li>
                  <li>
                    Lease agreement along with last 3 months rent receipt; or
                  </li>
                  <li>House purchase deed not older than 3 months.</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {step == 2 && (
          <>
            <p className="note text-justify !text-[14px] mb-8">
              At HAYVN we require that our clients have Net Assets of at least
              USD 500,000, excluding the value of their primary residence, at
              the time of registration. These measures are part of our
              Anti-Money Laundering and Know Your Client policies necessary for
              every type of business involving money transactions. Compliance
              with regulations prevents frauds from inflicting damage on us and
              on you and your financial assets. This is one of the multiple
              mandatory requirements required before carrying out any
              transactions and is closely observed by jurisdictional regulators.
            </p>
            <div className="form_section mb-8">
              <h5 className="mb-4">
                2.1. What is the main source of your annual income? *
              </h5>

              <div>
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
                {errors.annualIncomeSource && (
                  <div className="error_text">{errors?.annualIncomeSource}</div>
                )}
              </div>
            </div>
          </>
        )}
        {step == 3 && (
          <>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.1. Do you use an independent financial advisor / planner?*
              </h5>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  name="advisor"
                  value={true}
                  checked={values.advisor === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />

                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={false}
                  name="advisor"
                  checked={values.advisor === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.advisor && (
                <div className="error_text">{errors?.advisor}</div>
              )}
            </div>

            <div className="flex flex-col mb-8">
              <h5 className="mb-2">
                3.2. Which of these products have you invested in previously?*
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  value={true}
                  name="previousInvestments.derivatives"
                  checked={values.derivatives}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Derivatives</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  value="true"
                  name="previousInvestments.bonds"
                  checked={values.bonds}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Bonds</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  value={true}
                  name="previousInvestments.equities"
                  checked={values.equities}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Equities</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  value="true"
                  name="previousInvestments.commodities"
                  checked={values.commodities}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Commodities</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  value="true"
                  name="previousInvestments.assets"
                  checked={values.assets}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Virtual / Crypto Assets</span>
              </label>
              {errors.previousInvestments && (
                <div className="error_text">{errors?.previousInvestments}</div>
              )}
            </div>

            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.3 Have you ever used an electronic platform to trade?*
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="usedElecPlatform"
                  checked={values.usedElecPlatform === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="usedElecPlatform"
                  checked={values.usedElecPlatform === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.usedElecPlatform && (
                <div className="error_text">{errors?.usedElecPlatform}</div>
              )}
            </div>

            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.4 You should put all your money into the safest investment you
                can find and accept whatever returns it pays.*
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="safestInvestment"
                  checked={values.safestInvestment === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="safestInvestment"
                  checked={values.safestInvestment === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.safestInvestment && (
                <div className="error_text">{errors?.safestInvestment}</div>
              )}
            </div>

            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.5. Using a high interest credit card to buy a government bond
                is a good idea. *
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="governementBond"
                  checked={values.governementBond === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="governementBond"
                  checked={values.governementBond === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.governementBond && (
                <div className="error_text">{errors?.governementBond}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.6. An employee of a company with publicly traded stock should
                invest all of their retirement savings in the company’s stock. *
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="companyStock"
                  checked={values.companyStock === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="companyStock"
                  checked={values.companyStock === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.companyStock && (
                <div className="error_text">{errors?.companyStock}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.7. If interest rates rise, then bond prices will generally
                fall*{" "}
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="bondPrice"
                  checked={values.bondPrice === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="bondPrice"
                  checked={values.bondPrice === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.bondPrice && (
                <div className="error_text">{errors?.bondPrice}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.8. I understand the cryptocurrency market reasonably well and
                the largest cryptocurrency by market capitalization is Bitcoin*
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="largestCrypto"
                  checked={values.largestCrypto === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="largestCrypto"
                  checked={values.largestCrypto === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.largestCrypto && (
                <div className="error_text">{errors?.largestCrypto}</div>
              )}
            </div>

            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.9. Buying a single coin usually provides a safer return than a
                mutual fund or a diverse number of different coins*{" "}
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="saferReturn"
                  checked={values.saferReturn === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="saferReturn"
                  checked={values.saferReturn === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.saferReturn && (
                <div className="error_text">{errors?.saferReturn}</div>
              )}
            </div>

            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.10. Cryptocurrency markets are volatile, and your account
                needs constant monitoring.*{" "}
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"true"}
                  name="monitoring"
                  checked={values.monitoring === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="monitoring"
                  checked={values.monitoring === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.monitoring && (
                <div className="error_text">{errors?.monitoring}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.11. To make money in cryptocurrency markets, you have to buy
                and sell often.*{" "}
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="makeCryptoMoney"
                  checked={values.makeCryptoMoney === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="makeCryptoMoney"
                  checked={values.makeCryptoMoney === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.makeCryptoMoney && (
                <div className="error_text">{errors?.makeCryptoMoney}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">
                3.12. Suppose you invested $100 in cryptocurrency and the
                appreciation was 2% per year. After five years, you would have
                $110 of cryptocurrency.*{" "}
              </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={true}
                  name="returnValue"
                  checked={values.returnValue === "true"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5"
                  value={"false"}
                  name="returnValue"
                  checked={values.returnValue === "false"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">No</span>
              </label>
              {errors.returnValue && (
                <div className="error_text">{errors?.returnValue}</div>
              )}
            </div>
            <div className="flex gap-2 flex-col mb-8">
              <h5 className="mb-2">3.13. Risk Tolerance of the Individual* </h5>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"Conservative"}
                  name="riskTolerance"
                  checked={values.riskTolerance === "Conservative"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Convservative</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"Moderately Conservative"}
                  name="riskTolerance"
                  checked={values.riskTolerance === "Moderately Conservative"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Moderately Conservative</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"Moderate"}
                  name="riskTolerance"
                  checked={values.riskTolerance === "Moderate"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Moderate</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"Moderately Aggressive"}
                  name="riskTolerance"
                  checked={values.riskTolerance === "Moderately Aggressive"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Moderately Aggressive</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio color-primary h-5 w-5"
                  value={"Aggressive"}
                  name="riskTolerance"
                  checked={values.riskTolerance === "Aggressive"}
                  onChange={handleChange}
                  onBlur={validateField}
                />
                <span className="ml-2">Aggressive</span>
              </label>
              {errors.riskTolerance && (
                <div className="error_text">{errors?.riskTolerance}</div>
              )}
            </div>

            <div className="list_docs mt-5 mb-8">
              <h5 className="mb-4 font-bold">
                Please select the degree of risk that is to be taken with the
                assets in this account
              </h5>
              <ul className="list-disc text-justify ms-5 leading-5">
                <li>
                  <span className="font-bold"> Conservative:</span> Preserve
                  initial principal in this account, with minimal risk, even if
                  that means his account does not generate significant income or
                  returns and may not keep pace with inflation.
                </li>
                <li>
                  <span className="font-bold"> Moderately Conservative:</span>{" "}
                  Accept low risk to initial principal, including low
                  volatility, to seek a modest level of portfolio returns.{" "}
                </li>
                <li>
                  <span className="font-bold"> Moderate:</span> Accept some risk
                  to initial principal and tolerate some volatility to seek
                  higher returns, and understand it could lose a portion of the
                  money invested.
                </li>
                <li>
                  <span className="font-bold"> Moderately Aggressive:</span>{" "}
                  Accept high risk to initial principal, including high
                  volatility, to seek high returns over time, and understand it
                  could lose a substantial amount of the money invested.
                </li>
                <li>
                  <span className="font-bold"> Aggressive:</span> Accept maximum
                  risk to initial principal to aggressively seek maximum
                  returns, and understand it could lose most, or all, of the
                  money invested.
                </li>
              </ul>
            </div>
          </>
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

export default CertificationFormPage;
