import { useEffect } from "react";
import { useApi } from "./useApi";
import { useDispatch } from "react-redux";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";

const useGetUserDetaiils = () => {
  const dispatch = useDispatch();

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        dispatch(setUser(response));
      },
    });
  };

  return { isUserDetailsLoading, isUserDetailsError, getUserDetails };
};

export default useGetUserDetaiils;
