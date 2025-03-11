import { networks_available } from "@/constants/blockchains";
import * as Yup from "yup";

export const DepoistSchema = Yup.object().shape({
  blockchain: Yup.string().required("Blockchain is required"),
  network: Yup.string().when("blockchain", ([blockchain], schema) => {
    if (networks_available[blockchain]) {
      return schema.required(`Network is required for ${blockchain}`);
    }
    return schema.notRequired(); // No additional validation for other values
  }),
  amount: Yup.number()
    .typeError("Entered value must not be empty and should be a number")
    .required("Amount is required"),
  client_name: Yup.string().required("Client name is required"),
  client_email: Yup.string()
    .required("Email is required")
    .email("Invalid Email Format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Email format is not valid",
    }),
  client_phone_number: Yup.string().notRequired(),
  email_notification: Yup.boolean().required(),
  
});
