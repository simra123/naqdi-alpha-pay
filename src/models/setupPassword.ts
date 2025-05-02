import * as Yup from "yup";

export const setupPassword = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .test("passwords-match", function (value) {
      const parent = this.options.context?.parent || {};

      if (value != parent.password) {
        return this.createError({
          message: "Passwords must match",
        });
      }
      return true;
    }),
});
