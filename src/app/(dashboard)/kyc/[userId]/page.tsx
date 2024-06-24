"use client";

import { useDispatch } from "react-redux";
import ErrorApiText from "@/components/common/ErrorApiText";
import ImageModal from "@/components/common/ImageModal";
import LoadingApi from "@/components/common/LoadindApi";
import { useApi } from "@/hooks/useApi";
import {
  getUserDetailsApi,
  updateKYCStatusApi,
  updateUserFeeApi,
} from "@/services/admin/users";
import { callApiHook } from "@/utils/apifuncs";
import { Check, Close, OpenInNew } from "@mui/icons-material";
import { Button, TextareaAutosize } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import LoaderButton from "@/components/common/LoaderButton";

const statuses = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

const KYCUserID = ({ params }) => {
  const router = useRouter();
  const [url, setUrl] = useState(null);
  const [reason, setReason] = useState(null);
  const [fee, setFee]: any = useState(0);
  const userId = params?.userId;
  const [userDetails, setUserDetails] = useState(null);
  const [
    isUserDetailsListLoading,
    isUserDetailsListError,
    callUserDetailsListApi,
  ] = useApi(true);
  const [isFeeUpdateLoading, isFeeUpdateError, callFeeUpdateApi] = useApi();
  const [isKYCSubmitLoading, isKYCSubmitError, callKYCSubmitApi] = useApi();

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsListApi(getUserDetailsApi({ userId: +userId })),
      successCallBack: (response) => {
        setUserDetails(response);
        setFee(response?.fees ? response.fees : "0");
      },
    });
  };

  const handleSubmit = (status) => async () => {
    await callApiHook({
      apiCall: callKYCSubmitApi(
        updateKYCStatusApi({ userId: +userId, status, reason })
      ),
      successCallBack: (response) => {
        router.push("/");
      },
    });
  };

  const handleFeeSubmit = async () => {
    await callApiHook({
      apiCall: callFeeUpdateApi(
        updateUserFeeApi({ userId: +userId, fees: fee })
      ),
      successCallBack: (response) => {},
    });
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  return (
    <LoadingApi loading={isUserDetailsListLoading}>
      <ErrorApiText error={isUserDetailsListError}>
        <div className="border-2  py-6 px-3">
          <ImageModal isOpen={url} setIsOpen={setUrl} />

          <div className="tableheader flex items-center">
            <h2 className="text-lg font-bold">User Details</h2>
          </div>

          <div className="kycpage mt-6 flex flex-col gap-4 items-start">
            <div className="border-2 w-full p-3">
              <div className="flex flex-col gap-3">
                <p className="font-bold text-md">Set a Fee ( % )</p>
                <div className="w-[350px]">
                  <TransparentInput
                    value={fee}
                    onChange={(event) => setFee(event.target.value)}
                    disabled={false}
                    type="number"
                  />
                </div>
                <ErrorApiText error={isFeeUpdateError} />
                <div className="flex gap-2 justify-end">
                  <LoaderButton
                    variant="outlined"
                    content="Update"
                    loading={isFeeUpdateLoading}
                    onClick={handleFeeSubmit}
                  />
                </div>
              </div>
            </div>

            <div className="border-2 w-full p-3">
              <p className="font-bold text-md mb-6">KYC Details</p>

              <div className="flex gap-3 items-baseline">
                <p className="font-bold text-md">Format </p>

                <TransparentInput value={userDetails?.file_type} />
              </div>
              <div className="mt-4">
                <span className="font-bold text-md">Attachments </span>
                <div className="attachments flex gap-3 mt-4">
                  <div
                    className="wrapper relative border  cursor-pointer group"
                    onClick={() => setUrl(userDetails?.front_image)}
                  >
                    <img
                      src={userDetails?.front_image}
                      alt="front side"
                      className="max-w-full w-60"
                    />
                    <div className="opener absolute top-0 right-0 left-0 bottom-0 grid-cols-1 place-items-center backdrop-blur-sm hidden group-hover:grid">
                      <OpenInNew color="inherit" accentHeight={100} />
                    </div>
                  </div>
                  <div
                    className="wrapper relative border  cursor-pointer group"
                    onClick={() => setUrl(userDetails?.back_image)}
                  >
                    <img
                      src={userDetails?.back_image}
                      alt="front side"
                      className="max-w-full  w-60"
                    />
                    <div className="opener absolute top-0 right-0 left-0 bottom-0 grid-cols-1 place-items-center backdrop-blur-sm hidden group-hover:grid">
                      <OpenInNew color="inherit" accentHeight={100} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col my-4">
                <span className="font-bold text-md mb-3">Remarks </span>
                <TransparentInput
                  textarea
                  disabled={false}
                  onChange={(e) => setReason(e.target.value)}
                  value={reason}
                />
              </div>

              <LoadingApi loading={isKYCSubmitLoading}>
                <div className="buttons-wrapper flex items-center gap-2 justify-center">
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={handleSubmit(statuses.APPROVED)}
                    endIcon={<Check />}
                  >
                    Accept
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleSubmit(statuses.REJECTED)}
                    endIcon={<Close />}
                  >
                    Reject
                  </Button>
                  <ErrorApiText error={isKYCSubmitError} />
                </div>
              </LoadingApi>
            </div>
          </div>
        </div>
      </ErrorApiText>
    </LoadingApi>
  );
};

export default KYCUserID;
