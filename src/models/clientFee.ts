import * as Yup from "yup";

export const clientFeeSchema = Yup.object().shape({
  clientFee: Yup.number()
    .typeError("Entered value must not be empty and should be a number")
    .min(0.00)
    .max(10.00)
    .required("Amount between 0-10 is required"),
});
