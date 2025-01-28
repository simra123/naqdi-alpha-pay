"use client";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const UNVERIFIED_MESSAGE = "User is not verified";

interface Props {
  initailLoading?: boolean;
  notify?: boolean;
}

export const useApi = ({ initailLoading, notify }: Props = {}) => {


  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initailLoading);
  const [error, setError] = useState(null);

  const makeApiCall = async (apiCall: Function) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setIsLoading(false);
      setError(null);
      if (notify) {
        dispatch(
          setNotification({
            status: "success",
            message: response?.data?.message,
          })
        );
      }
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
          Cookies.remove("token");
          Cookies.remove("user");
          router.replace("/login");
          dispatch(
            setNotification({
              status: "error",
              message:
                error?.response?.data?.message ||
                "Your Session has been expired.",
            })
          );
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
