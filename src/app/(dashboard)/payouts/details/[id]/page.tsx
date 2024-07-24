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
    <DashboardPageWrapper>
      <ConfirmationModal
        handleClose={toggleConfirmModal}
        handleConfirm={handleApprove}
        isOpen={confirmModal}
        confirmLoading={isApprovePayoutLoading}
        title="Payout Confirmation"
      />

      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payout Details</h2>
        </div>
        <ErrorApiText error={isPayoutDetailsError} />
        <LoadingApi loading={isPayoutDetailsLoading}>
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper title={"Date"} align>
                <TransparentInput
                  label={`Created At`}
                  value={moment(payout?.created_at).format(
                    "DD-MM-YYYY hh:mm A"
                  )}
                />

                <TransparentInput
                  label={`Updated At`}
                  value={moment(payout?.updated_at).format(
                    "DD-MM-YYYY hh:mm A"
                  )}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"ID"}>
                <TransparentInput value={payout?.id} />
              </DetailsWrapper>

              <DetailsWrapper title={"Requested Amount"}>
                <TransparentInput
                  value={`${payout?.requested_amount} ${payout?.from_currency}`}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Fee"}>
                <TransparentInput
                  value={`${payout?.alphaspay_fees} ${payout?.from_currency}`}
                />
              </DetailsWrapper>

              <DetailsWrapper title={"Net Amount"}>
                <TransparentInput
                  value={`${payout?.amount} ${payout?.from_currency}`}
                />
              </DetailsWrapper>

              <DetailsWrapper title={"From Currency"}>
                <TransparentInput value={payout?.from_currency} />
              </DetailsWrapper>

              <DetailsWrapper title={"To Currency"}>
                <TransparentInput value={payout?.to_currency} />
              </DetailsWrapper>

              <DetailsWrapper title={"Account Title"}>
                <TransparentInput value={payout?.account_title} />
              </DetailsWrapper>

              <DetailsWrapper title={"To Bank Account"}>
                <TransparentInput value={payout?.account_no} />
              </DetailsWrapper>

              <DetailsWrapper title={"Status"}>
                <TransparentInput value={capitalize(payout?.status)} />
              </DetailsWrapper>

              {payout?.notes && (
                <DetailsWrapper title={"Notes"}>
                  <TransparentInput value={payout?.notes} textarea />
                </DetailsWrapper>
              )}

              {/* TABLES BELOW

              <div className="data-grid-container">
                <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Webhooks</h2>
                </div>

                <DataGrid
                  rows={[]}
                  columns={webhooks_table_columns}
                  className="font-semibold primary-color  border-t-0"
                  hideFooter
                  autoHeight
                />
              </div> */}
            </div>
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

              <ErrorApiText
                error={isApprovePayoutError || isRejectPayoutError}
              />
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
                  variant={"text"}
                  onClick={handleReject}
                />
              </div>
            </>
          )}
        </LoadingApi>
      </div>
    </DashboardPageWrapper>
  );
};

export default PayoutDetails;
