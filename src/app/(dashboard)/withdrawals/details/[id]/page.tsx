"use client";

import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  availableWallets_table_columns,
  converstion_table_columns,
  webhooks_table_columns,
} from "../../columns";
import { Role, Withdrawal_Type } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Chip } from "@mui/material";
import {
  CalendarMonth,
  Check,
  Mail,
  Payment,
  Person,
} from "@mui/icons-material";
import LoaderButton from "@/components/common/LoaderButton";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  getWithdrawalDetilsApi,
  withdrawalApproveAdminApi,
  withdrawalRejectAdminApi,
} from "@/services/withdrawal";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";
import Details from "@/components/common/Details";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import {
  CalenderIcon,
  FolderIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import { roundToPrecision } from "@/utils/math";
import CustomTable from "@/components/common/CustomTable";
import { transactionsList_table_columns } from "@/app/(dashboard)/users/columns";

const WithdrawalDetails = ({ params }) => {
  const user = useLocalStorage("user");
  const dispatch = useDispatch();
  const router = useRouter();
  const withdraw_id = +params?.id;

  const [withdrawalData, setWithdrawalData] = useState({
    txhash: "",
  });

  const [confirmModal, setConfirmModal] = useState(false);

  const [withdrawalType, setWithdrawalType] = useState(Withdrawal_Type.MANUAL);

  const [selectionModel, setSelectionModel] = useState([]);

  const [wallets, setWallets] = useState([]);

  const [withdrawalDetails, setwithdrawalDetails]: any = useState({});
  const [
    isWithdrawalDetailsLoading,
    isWithdrawalDetailsError,
    callWithdrawalDetailsApi,
  ] = useApi(true);

  const [
    isApproveWithdrawalLoading,
    isApproveWithdrawalError,
    callApproveWithdrawalApi,
  ] = useApi();
  const [
    isRejectWithdrawalLoading,
    isRejectWithdrawalError,
    callRejectWithdrawalApi,
  ] = useApi();

  const handleApprove = async () => {
    const manualData = {
      txhash: withdrawalData.txhash,
      withdraw_id: withdraw_id,
      withdrawal_mode: withdrawalType,
    };

    const AutomaticData = {
      withdraw_id: withdraw_id,
      withdrawal_mode: withdrawalType,
      sender_address: wallets.find((wallet) => wallet.id == selectionModel[0])
        ?.wallet_address,
    };

    const requestData =
      withdrawalType == Withdrawal_Type.AUTOMATIC ? AutomaticData : manualData;

    await callApiHook({
      apiCall: callApproveWithdrawalApi(withdrawalApproveAdminApi(requestData)),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Approved Successfully",
            status: "success",
          })
        );
        router.push("/withdrawals");
      },
    });
  };

  const handleReject = async () => {
    await callApiHook({
      apiCall: callRejectWithdrawalApi(
        withdrawalRejectAdminApi({ withdraw_id })
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Rejected Successfully",
            status: "success",
          })
        );
        router.push("/withdrawals");
      },
    });
  };

  const getWithdrawalDetails = async () => {
    await callApiHook({
      apiCall: callWithdrawalDetailsApi(
        getWithdrawalDetilsApi({ withdraw_id })
      ),
      successCallBack: (response: any) => {
        setwithdrawalDetails(response);

        const formattedTransactions = response?.paymentTransactions?.map(
          (transaction) => ({
            id: transaction.id,
            wallet_address: transaction?.wallet?.address,
            wallet_network: capitalize(transaction?.wallet?.blockchain),
            user_amount: `${transaction?.amount} ${
              transaction?.unit ? transaction?.unit : ""
            }`,
            total_amount: `${transaction?.wallet?.amount} ${
              transaction?.unit ? transaction?.unit : ""
            }`,
          })
        );

        const formattedWallets = response?.walletsWithUnit?.map((wallet) => ({
          id: wallet.id + wallet?.wallet_address,
          wallet_address: wallet.wallet_address,
          wallet_network: capitalize(wallet.blockchain),
          user_amount: `${wallet.amount}  ${wallet?.unit ? wallet?.unit : ""}`,
          total_amount: `${wallet.amount}  ${wallet?.unit ? wallet?.unit : ""}`, // Assuming total amount here refers to the same amount for wallets
        }));

        console.log(formattedTransactions, formattedWallets);

        setWallets(
          formattedTransactions
            ? [...formattedTransactions, ...formattedWallets]
            : [...formattedWallets]
        );
      },
    });
  };

  useEffect(() => {
    getWithdrawalDetails();
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setWithdrawalData((pre) => ({ ...pre, [name]: value }));
  };

  const handleWithdrawalType = (type: Withdrawal_Type) => () => {
    setWithdrawalData((pre) => ({ ...pre, txhash: "" }));
    setSelectionModel([]);
    setWithdrawalType(type);
  };

  const handleConfirm = () => {
    handleApprove();
    toggleConfirmModal();
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  return (
    <LoadingApi loading={isWithdrawalDetailsLoading}>
      <div className="rounded-medium flex flex-col  bg-white p-6">
        <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
          Withdrawal Details
        </h3>

        <ConfirmationModal
          handleClose={toggleConfirmModal}
          handleConfirm={handleConfirm}
          isOpen={confirmModal}
          confirmLoading={isApproveWithdrawalLoading}
          title="Withdrawal Confirmation"
        />

        <>
          <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
            <FolderIcon />
            <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="Blockchain"
              value={
                withdrawalDetails?.walletsWithUnit
                  ? withdrawalDetails?.walletsWithUnit[0]?.blockchain
                  : " _"
              }
            />

            <Details label="ID" value={withdrawalDetails?.withdrawal?.id} />
            <Details
              label={`${withdrawalDetails?.withdrawal?.unit} ${
                withdrawalDetails?.withdrawal?.standard &&
                `(${withdrawalDetails?.withdrawal?.standard})`
              } Wallet Address`}
              value={withdrawalDetails?.withdrawal?.recipient_address}
            />
            <Details
              label={"Transaction Hash"}
              value={withdrawalDetails?.withdrawal?.transaction_hash || "_"}
            />
          </div>

          <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
            <CalenderIcon />
            <h5 className="text-purple-100 text-h5 font-semibold">Dates</h5>
          </div>

          <div className="res-2-grid py-6">
            <Details
              label="Created Date"
              value={moment(withdrawalDetails?.withdrawal?.created_at).format(
                "DD-MM-YYYY : hh:mm A"
              )}
            />
            <Details
              label="Updated Date"
              value={moment(withdrawalDetails?.withdrawal?.updated_at).format(
                "DD-MM-YYYY : hh:mm A"
              )}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
            <PaymentIcon />
            <h5 className="text-purple-100 text-h5 font-semibold">
              Withdrawals
            </h5>
          </div>

          <div className="res-2-grid py-6">
            <Details
              label="Requested Amount"
              value={`${withdrawalDetails?.withdrawal?.requested_amount} ${withdrawalDetails?.withdrawal?.unit}`}
            />
            <Details
              label="Fee"
              value={`${withdrawalDetails?.withdrawal?.withdraw_fees} ${withdrawalDetails?.withdrawal?.unit}`}
            />
            <Details
              label="Net Amount"
              value={`${withdrawalDetails?.withdrawal?.net_amount} ${withdrawalDetails?.withdrawal?.unit}`}
            />
          </div>

          <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
            <StatusIcon />
            <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
          </div>

          <div className="res-2-grid py-6">
            <Details
              label="Withdrawal Status"
              value={withdrawalDetails?.withdrawal?.status}
            />
          </div>

          <h4 className="text-button font-semibold my-5">Notes</h4>

          <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
            {withdrawalDetails?.withdrawal?.notes}
          </div>
        </>

        <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <div className="my-4 flex flex-col gap-4">
                <div className=" flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">User Details</h2>
                </div>

                <DetailsWrapper title={"Name"} align>
                  <TransparentInput
                    label={`First Name`}
                    value={withdrawalDetails?.withdrawal?.user?.first_name}
                  />

                  <TransparentInput
                    label={`Last Name`}
                    value={withdrawalDetails?.withdrawal?.user?.last_name}
                  />
                </DetailsWrapper>

                <DetailsWrapper title={"Contact"} align>
                  <TransparentInput
                    label={`Email`}
                    value={withdrawalDetails?.withdrawal?.user?.email}
                  />

                  <TransparentInput
                    label={`Phone`}
                    value={
                      withdrawalDetails?.withdrawal?.user?.userDetails
                        ?.phone_number
                    }
                  />
                </DetailsWrapper>
              </div>

              <DetailsWrapper title={"Withdrawal Mode"}>
                <Chip
                  label="Manual"
                  color="primary"
                  onClick={handleWithdrawalType(Withdrawal_Type.MANUAL)}
                  icon={
                    withdrawalType == Withdrawal_Type.MANUAL && (
                      <Check className="text-sm" />
                    )
                  }
                  variant={
                    withdrawalType == Withdrawal_Type.MANUAL
                      ? "filled"
                      : "outlined"
                  }
                  clickable
                />
                <Chip
                  label="Automatic"
                  onClick={handleWithdrawalType(Withdrawal_Type.AUTOMATIC)}
                  color="primary"
                  icon={
                    withdrawalType == Withdrawal_Type.AUTOMATIC && (
                      <Check className="text-sm" />
                    )
                  }
                  variant={
                    withdrawalType == Withdrawal_Type.AUTOMATIC
                      ? "filled"
                      : "outlined"
                  }
                  clickable
                />
              </DetailsWrapper>

              {withdrawalType == Withdrawal_Type.MANUAL && (
                <DetailsWrapper title={"Transaction Hash"}>
                  <TransparentInput
                    value={withdrawalData?.txhash}
                    name="txhash"
                    disabled={false}
                    onChange={handleChange}
                  />
                </DetailsWrapper>
              )}

              <div className="data-grid-container">
                <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Wallets Available</h2>
                </div>

                <DataGrid
                  rows={wallets}
                  columns={availableWallets_table_columns}
                  className="font-semibold primary-color  border-t-0"
                  checkboxSelection={
                    withdrawalType == Withdrawal_Type.AUTOMATIC
                  }
                  disableMultipleRowSelection
                  hideFooter
                  autoHeight
                  rowSelectionModel={selectionModel}
                  onRowSelectionModelChange={handleSelectionChange}
                />
              </div>
            </div>

            <ErrorApiText
              error={isApproveWithdrawalError || isRejectWithdrawalError}
            />
            <div className="flex gap-2 justify-center max-w-[75%] mb-7 mt-10 ">
              <LoaderButton
                loading={isRejectWithdrawalLoading}
                content={"Reject"}
                variant={"outlined"}
                onClick={handleReject}
              />

              <Button
                variant="outlined"
                className="py-2 px-8"
                onClick={toggleConfirmModal}
                disabled={
                  withdrawalData?.txhash || selectionModel?.length
                    ? false
                    : true
                }
              >
                Approve
              </Button>
            </div>
          </div>
        </RenderRoleBased>

        <ErrorApiText error={isWithdrawalDetailsError} />
      </div>

      <div className="mt-8">
        <CustomTable
          columns={transactionsList_table_columns}
          rows={[]}
          actions={
            <h3 className="text-h3.5 font-semibold text-blackGrey-100 mb-8">
              Related Transactions
            </h3>
          }
          rowClickHandler={(row: any) =>
            router.push(`/transactions/details/${row?.id}?type=Self Depoist`)
          }
          columnClassName="max-w-[200px]"
        />
      </div>
    </LoadingApi>
  );
};

export default WithdrawalDetails;
