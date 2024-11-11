import * as Yup from "yup";

export const paymentSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Entered value must not be empty and should be a number").min(1, 'Payment amount should atleast be 1 USD')
    .required("Source amount is required"),
});
