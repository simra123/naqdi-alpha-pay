import * as Yup from "yup";

export const PhoneSchema = Yup.object().shape({
  phone: Yup.string().required("Phone number is required"),
});

export const codeSchema = Yup.object().shape({
  code: Yup.string()
    .required("Phone number is required")
    .min(6, "Invalid Otp Length")
    .max(6, "Invalid Otp Length"),
});
