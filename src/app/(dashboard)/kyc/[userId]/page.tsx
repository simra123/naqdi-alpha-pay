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
import { Cancel, Check, Close, OpenInNew } from "@mui/icons-material";
import { Link, TextareaAutosize, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
            <div className="flex flex-col gap-3">
              <p className="font-bold text-md">Set a Fee ( % )</p>
              <div className="flex items-center">
                <LoadingApi loading={isFeeUpdateLoading}>
                  <input
                    className="input-field type outline-none px-3 py-3 min-w-56 "
                    minLength={0}
                    min={0}
                    max={100}
                    maxLength={100}
                    value={fee}
                    onChange={(event) => setFee(event.target.value)}
                    type="number"
                  />
                  <button
                    className="btn gradient-btn px-4 !m-0 no-radius"
                    onClick={handleFeeSubmit}
                  >
                    Update
                  </button>
                </LoadingApi>
              </div>
              <ErrorApiText error={isFeeUpdateError} />
            </div>
            <div className="flex gap-3">
              <p className="font-bold text-md">Format : </p>
              <p className="font-semibold text-md">{userDetails?.file_type}</p>
            </div>
            <div>
              <span className="font-bold text-md">Attachments </span>
              <div className="attachments flex gap-3 mt-4">
                <div
                  className="wrapper relative  cursor-pointer group"
                  onClick={() => setUrl(userDetails?.front_image)}
                >
                  <img
                    src={userDetails?.front_image}
                    alt="front side"
                    className="max-w-full"
                  />
                  <div className="opener absolute top-0 right-0 left-0 bottom-0 grid-cols-1 place-items-center backdrop-blur-sm hidden group-hover:grid">
                    <OpenInNew color="inherit" accentHeight={100} />
                  </div>
                </div>
                <div
                  className="wrapper relative  cursor-pointer group"
                  onClick={() => setUrl(userDetails?.back_image)}
                >
                  <img
                    src={userDetails?.back_image}
                    alt="front side"
                    className="max-w-full"
                  />
                  <div className="opener absolute top-0 right-0 left-0 bottom-0 grid-cols-1 place-items-center backdrop-blur-sm hidden group-hover:grid">
                    <OpenInNew color="inherit" accentHeight={100} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col ">
              <span className="font-bold text-md">Remarks </span>
              <TextareaAutosize
                className="input-field p-3 outline-none min-h-14 min-w-96 block mt-4"
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            </div>

            <LoadingApi loading={isKYCSubmitLoading}>
              <div className="buttons-wrapper flex items-center gap-2 justify-center">
                <button
                  className="btn-status success"
                  onClick={handleSubmit(statuses.APPROVED)}
                >
                  <Check />
                  <span>Accept</span>
                </button>
                <button
                  className="btn-status error"
                  onClick={handleSubmit(statuses.REJECTED)}
                >
                  <Close />
                  <span> Reject</span>
                </button>
                <ErrorApiText error={isKYCSubmitError} />
              </div>
            </LoadingApi>
          </div>
        </div>
      </ErrorApiText>
    </LoadingApi>
  );
};

export default KYCUserID;
