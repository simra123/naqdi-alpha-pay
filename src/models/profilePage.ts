import * as Yup from "yup";

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmNewPassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("newPassword")], "Your passwords do not match."),
  otp: Yup.string().min(6, "Invalid Otp length").required("OTP is required"),
});
