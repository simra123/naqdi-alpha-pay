"use client";

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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoaderButton from "@/components/common/LoaderButton";
import IconField from "@/components/common/IconField";
import Details from "@/components/common/Details";
import KYCReasonModal from "@/components/common/KYCReasonModal";

const statuses = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

const KYCUserID = ({ params }) => {
  const router = useRouter();
  const [url, setUrl] = useState(null);
  const [isRejectOpen, setRejectOpen] = useState(false);
  const [isFees, setIsFees] = useState(false);
  const [reason, setReason] = useState({ reason: "" });
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
        setFee(response?.fees ? response.fees : null);
      },
    });
  };

  const handleSubmit = (status) => async () => {
    await callApiHook({
      apiCall: callKYCSubmitApi(
        updateKYCStatusApi({ userId: +userId, status, ...reason })
      ),
      successCallBack: (response) => {
        getUserDetails();
        setRejectOpen(false);
      },
    });
  };

  const handleFeeSubmit = async () => {
    await callApiHook({
      apiCall: callFeeUpdateApi(
        updateUserFeeApi({ userId: +userId, fees: fee })
      ),
      successCallBack: (response) => {
        setIsFees(true);
      },
    });
  };

  const toggleRejectHandler = () => {
    setRejectOpen(!isRejectOpen);
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  return (
    <LoadingApi loading={isUserDetailsListLoading}>
      <ImageModal isOpen={url} setIsOpen={setUrl} />
      <KYCReasonModal
        isOpen={isRejectOpen}
        data={reason}
        error={isKYCSubmitError}
        loading={isKYCSubmitLoading}
        handleSubmit={handleSubmit(statuses.REJECTED)}
        setData={setReason}
        toggleHandler={toggleRejectHandler}
      />
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        User Details
      </h3>
      <ErrorApiText error={isUserDetailsListError}>
        {userDetails?.kyc_approved && (
          <div className="rounded-medium flex flex-col  bg-white p-6 sm:p-10 shadow-sm">
            <div>
              <p className="font-semibold text-button">Set a Fee ( % )</p>
              <div className="flex flex-col items-start xl:flex-row gap-6 xl:gap-0 justify-between xl:items-center mt-4">
                <IconField
                  inputContainerClassName="!bg-blackGrey-filled-input w-full"
                  wrapperClassName="!mb-0 max-w-full w-[460px]"
                  placeholder="Enter Fees"
                  name={"fee"}
                  value={fee}
                  onChange={(event) => setFee(event.target.value)}
                  error={isFeeUpdateError}
                  type="number"
                />
                <div className="w-[260px] max-w-full">
                  <LoaderButton
                    variant="contained"
                    content={userDetails?.fees || isFees ? "Update" : "Save"}
                    loading={isFeeUpdateLoading}
                    onClick={handleFeeSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-medium flex flex-col mt-8 bg-white p-6 sm:p-10 shadow-sm">
          <p className="font-semibold text-button">KYC Details</p>

          <div className="py-6">
            <Details label="Document Format" value={userDetails?.file_type} />
          </div>

          <div className="mt-4">
            <p className="font-semibold text-button">Attachments</p>

            <div className="attachments flex gap-3 flex-wrap mt-4">
              <div
                className="wrapper relative  cursor-pointer group"
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
                className="wrapper relative  cursor-pointer group"
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

          <ErrorApiText error={isKYCSubmitError} />

          <div className="grid grid-cols-2 sm:flex gap-4 items-center mt-14 flex-wrap">
            <LoaderButton
              content={"Reject"}
              color="error"
              onClick={toggleRejectHandler}
              variant="text"
            />

            <LoaderButton
              variant="text"
              color="success"
              onClick={handleSubmit(statuses.APPROVED)}
              content={"Approve"}
            />
          </div>
        </div>
      </ErrorApiText>
    </LoadingApi>
  );
};

export default KYCUserID;
