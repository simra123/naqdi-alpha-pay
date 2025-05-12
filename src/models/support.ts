import { supportOptions } from "@/constants/types";
import * as Yup from "yup";

const supportValues = supportOptions.map((option) => option.value);

const supportSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  concern: Yup.string()
    .oneOf(supportValues, "Please select a valid type")
    .required("Type is required"),
  message: Yup.string().required("Message is required"),
  attachments: Yup.mixed().notRequired(),
});

export default supportSchema;
