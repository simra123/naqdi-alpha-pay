import * as Yup from "yup";

export const ProfileSchema = Yup.object().shape({
  addressLine1: Yup.string()
    .required("Address is Required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  country: Yup.string().required("Please select a country"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal Code is required"),
});
