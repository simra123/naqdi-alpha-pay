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
      setErrors({ ...errors, [name]: undefined });
    } catch (error) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleSubmit = async (event, callback) => {
    event.preventDefault();
    try {
      await validationSchema.validate(values, { abortEarly: false });
      callback();
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  return {
    values,
    errors,
    handleChange,
    validateField,
    handleSubmit,
  };
};

export default useFormValidation;
