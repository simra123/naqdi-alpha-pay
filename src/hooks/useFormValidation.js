"use client";
import { useState } from "react";
import * as Yup from "yup";

const useFormValidation = (initialState, validationSchema) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, files, checked } = event.target;

    if (type == "file") {
      const nameSplit = name.split(`.`);
      if (nameSplit?.length > 1) {
        setValues({
          ...values,
          [nameSplit[0]]: {
            ...values[nameSplit[0]],
            [nameSplit[1]]: files[0],
          },
        });
      } else {
        setValues({
          ...values,
          [name]: files[0],
        });
      }
    } else if (type == "checkbox") {
      const nameSplit = name.split(`.`);
      console.log(nameSplit);
      setValues({
        ...values,
        [nameSplit[0]]: {
          ...values[nameSplit[0]],
          [nameSplit[1]]: checked,
        },
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
    // validateField(name, value);
  };

  const validateField = async (event) => {
    const { name, value } = event.target;
    try {
      await Yup.reach(validationSchema, name).validate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }
  };

  const handleSubmit = async (event, callback, errorCallBack) => {
    event.preventDefault();
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      callback();
    } catch (validationErrors) {
      const formattedErrors = {};
      console.log(validationErrors);
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      errorCallBack && errorCallBack();
    }
  };

  return {
    values,
    errors,
    handleChange,
    validateField,
    handleSubmit,
    setErrors,
    setValues,
  };
};

export default useFormValidation;
