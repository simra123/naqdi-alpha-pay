import * as Yup from "yup";

export const urlSchema = Yup.object().shape({
  url: Yup.string()
    .url("Must be a valid URL") // Check for valid URL format
    .test(
      "is-https",
      "URL must start with https",
      (value) => value?.startsWith("https://") // Custom test for https
    )
    .required("URL is required"),
});
