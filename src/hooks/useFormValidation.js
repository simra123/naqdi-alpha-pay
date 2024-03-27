"use client";
import { useState } from "react";
import * as Yup from "yup";

const useFormValidation = (initialState, validationSchema) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
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
