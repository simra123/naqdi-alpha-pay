"use client";

import React, { useEffect, useState } from "react";

import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { getLocalStorageValue } from "@/utils/cookies";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  approvePayoutApi,
  payoutDetailsApis,
  rejectPayoutApi,
} from "@/services/payout";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/common/LoaderButton";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import { Role } from "@/constants/roles";
import Details from "@/components/common/Details";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import IconField from "@/components/common/IconField";

const PayoutDetails = ({ params }) => {
  const payout_id = +params?.id;
  const user = getLocalStorageValue("user");
  const dispatch = useDispatch();
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [payout, setpayout] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isPayoutDetailsLoading, isPayoutDetailsError, callPayoutDetailsApi] =
    useApi({ initailLoading: true });

  const [isApprovePayoutLoading, isApprovePayoutError, callApprovePayoutApi] =
    useApi();
  const [isRejectPayoutLoading, isRejectPayoutError, callRejectPayoutApi] =
    useApi();

  const handleApprove = async () => {
    await callApiHook({
      apiCall: callApprovePayoutApi(approvePayoutApi({ payout_id })),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Payout Request Approved Successfully",
            status: "success",
          })
        );
        router.push("/payouts");
      },
    });
  };

  const handleReject = async () => {
    await callApiHook({
      apiCall: callRejectPayoutApi(rejectPayoutApi({ payout_id, reason })),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Payout Request Rejected Successfully",
            status: "success",
          })
        );
        router.push("/payouts");
      },
    });
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const getPayoutDetails = async () => {
    await callApiHook({
      apiCall: callPayoutDetailsApi(payoutDetailsApis({ payout_id })),
      successCallBack: (response: any) => {
        setpayout(response);
      },
    });
  };

  useEffect(() => {
    getPayoutDetails();
  }, []);

  return (
    <div className="flex flex-col bg-white p-6 rounded-medium">
      <h3 className="font-semibold text-blackGrey-100 text-h3.5">
        Payout Details
      </h3>
      <ConfirmationModal
        handleClose={toggleConfirmModal}
        handleConfirm={handleApprove}
        isOpen={confirmModal}
        confirmLoading={isApprovePayoutLoading}
        title="Payout Confirmation"
      />

      <LoadingApi loading={isPayoutDetailsLoading}>
        <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
          <FolderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="ID" value={payout?.payout_uuid} />
          <Details label="Account Title" value={payout?.account_title} />
          <Details label="Account No." value={payout?.account_no} />
          <Details label="From Currency" value={payout?.from_currency} />
          <Details label="To Currency" value={payout?.to_currency} />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <CalenderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Dates</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Created Date"
            value={moment(payout?.created_at).format("DD-MM-YYYY hh:mm A")}
          />
          <Details
            label="Updated Date"
            value={moment(payout?.updated_at).format("DD-MM-YYYY hh:mm A")}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <PaymentIcon active={false} />
          <h5 className="font-semibold text-h5 text-purple-500">Payouts</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Requested Amount"
            value={`${payout?.requested_amount} ${payout?.to_currency}`}
          />
          <Details
            label="Fee Amount"
            value={`${payout?.alphaspay_fees} ${payout?.to_currency}`}
          />
          <Details
            label="Net Amount"
            value={`${payout?.amount} ${payout?.to_currency}`}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <StatusIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details label="Payment Status" value={payout?.status} />
        </div>

        <h4 className="my-5 font-semibold text-button">Notes</h4>

        <div className="p-4 border border-light-gray rounded-large w-full min-h-36 font-medium text-gray-400">
          {payout?.notes}
        </div>

        {user?.role == Role.ADMIN && (
          <>
            <DetailsWrapper title={"Reason*"}>
              <IconField
                value={reason}
                disabled={false}
                onChange={(e) => setReason(e.target.value)}
              />
            </DetailsWrapper>

            <ErrorApiText error={isApprovePayoutError || isRejectPayoutError} />
            <div className="flex justify-center gap-2 mt-10 mb-7 max-w-[75%]">
              <button

                className="px-8 py-2"
                onClick={toggleConfirmModal}
              >
                Approve
              </button>
              <LoaderButton
                loading={isRejectPayoutLoading}
                content={"Reject"}
                variant={"outlined"}
                onClick={handleReject}
              />
            </div>
          </>
        )}

        <ErrorApiText error={isPayoutDetailsError} />
      </LoadingApi>
    </div>
  );
};

export default PayoutDetails;
