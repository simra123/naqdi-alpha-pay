import * as Yup from "yup";

export const ProfileSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string().required("New Password is required"),
  confirmNewPassword: Yup.string().when(
    "newPassword",
    ([newPassword], schema, options) => {
      if (newPassword != "") {
        if (options.value == "") {
          return schema.required();
        } else {
          // if the password filled and passwordConfirmation then return mismatch

          return schema.oneOf([newPassword], "Passwords don't match");
        }
      } else {
        return schema;
      }
    }
  ),
  otp: Yup.string().min(6, "Invalid Otp length").required("OTP is required"),
});
