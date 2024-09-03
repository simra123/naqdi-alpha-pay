"use client";

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { webhooks_table_columns } from "../../columns";
import useLocalStorage from "@/hooks/useLocalStorage";
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
import { capitalize } from "@/utils/dataFormatters";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/common/LoaderButton";
import { Button } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Role } from "@/constants/roles";
import Details from "@/components/common/Details";
import { CalendarMonth, Mail, Payment, Person } from "@mui/icons-material";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";

const PayoutDetails = ({ params }) => {
  const payout_id = +params?.id;
  const user = useLocalStorage("user");
  const dispatch = useDispatch();
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [payout, setpayout] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isPayoutDetailsLoading, isPayoutDetailsError, callPayoutDetailsApi] =
    useApi(true);

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
    <div className="rounded-medium flex flex-col  bg-white p-6">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
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
        <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
          <FolderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="ID" value={payout?.id} />
          <Details label="Account Title" value={payout?.account_title} />
          <Details label="Account No." value={payout?.account_no} />
          <Details label="From Currency" value={payout?.from_currency} />
          <Details label="To Currency" value={payout?.to_currency} />
        </div>

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <CalenderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Dates</h5>
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

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <PaymentIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Payouts</h5>
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

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <StatusIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details label="Payment Status" value={payout?.status} />
        </div>

        <h4 className="text-button font-semibold my-5">Notes</h4>

        <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
          {payout?.notes}
        </div>

        {user?.role == Role.ADMIN && (
          <>
            <DetailsWrapper title={"Reason*"}>
              <TransparentInput
                value={reason}
                textarea
                disabled={false}
                onChange={(e) => setReason(e.target.value)}
              />
            </DetailsWrapper>

            <ErrorApiText error={isApprovePayoutError || isRejectPayoutError} />
            <div className="flex gap-2 justify-center max-w-[75%] mb-7 mt-10 ">
              <Button
                variant="outlined"
                className="py-2 px-8"
                onClick={toggleConfirmModal}
              >
                Approve
              </Button>
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
