import * as Yup from "yup";

export const Step1Schema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is Required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),

  lastName: Yup.string("Invalid Format")
    .required("Last name is required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  passport: Yup.string().required("File is required"),
  addressline1: Yup.string()
    .required("Address is Required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  country: Yup.string().required("Please select a country"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  addressProof: Yup.string().required("File is required"),
});

export const Step2Schema = Yup.object().shape({
  annualIncomeSource: Yup.string()
    .required("Income Source is Required")
    .min(3, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
});

export const Step3Schema = Yup.object().shape({
  advisor: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  previousInvestments: Yup.object()
    .shape({
      derivatives: Yup.mixed(),
      bonds: Yup.mixed(),
      equities: Yup.mixed(),
      commodities: Yup.mixed(),
      assets: Yup.mixed(),
    })
    .test({
      name: "atLeastOneSelected",
      test: (value) => {
        const { derivatives, bonds, equities, commodities, assets } = value;
        return derivatives || bonds || equities || commodities || assets;
      },
      message: "At least one option must be selected",
    }),
  usedElecPlatform: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),

  safestInvestment: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  governementBond: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  companyStock: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  bondPrice: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  largestCrypto: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  saferReturn: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  monitoring: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  makeCryptoMoney: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  returnValue: Yup.string()
    .oneOf(["false", "true"], "Please select an option")
    .required("Please select an option"),
  riskTolerance: Yup.string().required("Please select an option"),
});
