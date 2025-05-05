"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import { setNotification } from "@/store/slices/modal.Slice";
import { clearApiCache, setApiCache } from "@/store/slices/apiCache.slice";
import type { RootState } from "@/store";
import { parseQueueDelay } from "@/utils/math";

const UNVERIFIED_MESSAGE = "User is not verified";
const CACHE_DURATION_MS = parseQueueDelay(); // 2 minutes

interface Props {
  initailLoading?: boolean;
  notify?: boolean;
}

const sanitizeAxiosResponse = (response: any) => ({
  data: response.data,
  status: response.status,
  // Omit config, headers, request, etc.
});

export const useApi = ({ initailLoading, notify }: Props = {}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initailLoading);
  const [error, setError] = useState(null);
  const cache = useSelector((state: RootState) => state.apiCache);

  const makeApiCall = async (
    apiCall: () => Promise<any>,
    options?: {
      enableCache?: boolean;
      cacheKey?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    const { enableCache = false, cacheKey } = options || {};
    const finalKey = cacheKey || apiCall.toString();

    // Handle cache
    if (enableCache) {
      const cached = cache[finalKey];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
        setIsLoading(false);
        return cached.response;
      }
    }

    try {
      const response = await apiCall();

      setIsLoading(false);
      if (notify) {
        dispatch(
          setNotification({
            status: "success",
            message: response?.data?.message ?? "Success",
          })
        );
      }

      if (enableCache) {
        dispatch(
          setApiCache({
            key: finalKey,
            response: sanitizeAxiosResponse(response),
          })
        );
      }

      return response;
    } catch (error: any) {
      setIsLoading(false);

      if (error?.response?.status === 401) {
        if (error.response?.data?.message === UNVERIFIED_MESSAGE) {
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
          dispatch(clearApiCache());
          dispatch(
            setNotification({
              status: "error",
              message:
                error?.response?.data?.message || "Your Session has expired.",
            })
          );
        }
      }

      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred. Please try again later.";

      setError(errorMessage);
      throw error;
    }
  };

  return [isLoading, error, makeApiCall, setError];
};
