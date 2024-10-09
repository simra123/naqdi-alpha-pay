import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email or Username is required"),
  password: Yup.string().required("password is required"),
});

export const mfaSchema = Yup.object().shape({
  otp: Yup.string().length(6).required("Otp code is required"),
});
