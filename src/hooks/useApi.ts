"use client";
import { setNotification } from "@/store/slices/modal.Slice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const useApi = (initailLoading = false) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(initailLoading);
  const [error, setError] = useState(null);

  const makeApiCall = async (apiCall) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      console.log(response);
      setIsLoading(false);
      setError(null);
      console.log("    <<<<    RESPONSE FROM THE API     >>>>    ", response);
      dispatch(
        setNotification({ status: "success", message: response?.data?.message })
      );
      return response;
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      const errorMessage =
        err?.response?.data?.message ||
        "An error occurred. Please try again later";
      setError(errorMessage);

      throw err;
    }
  };

  return [isLoading, error, makeApiCall, setError];
};
