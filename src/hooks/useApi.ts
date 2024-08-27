"use client";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

const UNVERIFIED_MESSAGE = "User is not verified";

export const useApi = (initailLoading = false) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initailLoading);
  const [error, setError] = useState(null);

  const makeApiCall = async (apiCall: Function) => {
    setIsLoading(true);
    setError(null);

    console.log("MAKING AN API CALL IN HOOK");

    try {
      const response = await apiCall();
      setIsLoading(false);
      setError(null);
      console.log("    <<<<    RESPONSE FROM THE API     >>>>    ", response);
      dispatch(
        setNotification({ status: "success", message: response?.data?.message })
      );
      return response;
    } catch (error) {
      setIsLoading(false);

      if (error.response.status == 401) {
        if (error?.response?.data?.message == UNVERIFIED_MESSAGE) {
          router.replace("/email-verification-required");
          dispatch(
            setNotification({
              status: "error",
              message:
                "You are not verified. Check Spam or get Email for verification.",
            })
          );
        } else {
          // window?.localStorage?.removeItem("token");
          // window?.localStorage?.removeItem("user");
          // router.replace("/login");
          // dispatch(
          //   setNotification({
          //     status: "error",
          //     message: "Your Session has expired.",
          //   })
          // );
        }
      }
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred. Please try again later";
      setError(errorMessage);

      throw error;
    }
  };

  return [isLoading, error, makeApiCall, setError];
};
