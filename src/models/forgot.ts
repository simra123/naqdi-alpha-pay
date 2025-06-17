import * as Yup from "yup";

export const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Email format is not valid",
    }),
});
