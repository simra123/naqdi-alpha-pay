import * as Yup from "yup";

export const IdentityCheckSchema = Yup.object().shape({
  country: Yup.string().required("Please select a country"),
  document: Yup.object()
    .shape({
      front: Yup.mixed(),
      back: Yup.mixed(),
    })
    .test({
      name: "atLeastOneSelected",
      test: (value) => {
        const { back, front } = value;
        return back && front;
      },
      message: "Both Images are required",
    }),
  documentFormat: Yup.string().required("Please select a format"),
});
