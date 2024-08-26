import * as Yup from "yup";

const _register = {
  firstName: Yup.string()
    .required("First name is Required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Email format is not valid",
    }),
  userName: Yup.string()
    .required("Username is required")
    .matches(/^[a-zA-Z0-9_]+$/, {
      message: "Only text, numbers, and underscores are allowed",
    })
    .required("Username is required"),
  password: Yup.string()
    .required("password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&./]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  captcha: Yup.string().required("Please verify by checking the captcha"),
};

const _legal = {
  legalName: Yup.string()
    .required("Legal name is Required")
    .min(2, "Minimum 2 letters required")
    .max(50, "Maximum 50 letters only."),
  entityType: Yup.string().required("Please Select Entity Type"),
};

export const LegalSchema = Yup.object().shape({ ..._legal, ..._register });
export const RegisterSchema = Yup.object().shape(_register);
