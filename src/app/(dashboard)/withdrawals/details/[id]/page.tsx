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
import { Check } from "@mui/icons-material";
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

const dummyRows = [
  {
    id: 1,
    wallet_address: "0x4e1a5dfcB8D4e2c8eC7d14d3F3A6D4E5A1aB3C2b",
    wallet_network: "Ethereum",
    user_amount: 1.5,
    total_amount: 100.0,
  },
  {
    id: 2,
    wallet_address: "0x3C6dA2dF1E5E4aD7d9F8B5c6bA7cE9f6B2dA8eF3",
    wallet_network: "Binance Smart Chain",
    user_amount: 2.0,
    total_amount: 200.0,
  },
  {
    id: 3,
    wallet_address: "0x9D8fA7dD2cA5dB3dA1f6eE7bF2E3fC8bE7fB4a2E",
    wallet_network: "Polygon",
    user_amount: 3.2,
    total_amount: 150.0,
  },
  {
    id: 4,
    wallet_address: "0x6bA3c5D1e7D9A1c2B3fE4fE7dE6dB4b9F3C4a9dA",
    wallet_network: "Solana",
    user_amount: 0.8,
    total_amount: 250.0,
  },
  {
    id: 5,
    wallet_address: "0x7cC4eD2b9B5cF8aD4eE6aE7bE5A4D9f5F2eB6bC8",
    wallet_network: "Avalanche",
    user_amount: 1.1,
    total_amount: 175.0,
  },
];

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
    }

    const AutomaticData = {
      withdraw_id: withdraw_id,
      withdrawal_mode: withdrawalType,
      sender_address: wallets.find(wallet => wallet.id == selectionModel[0])?.wallet_address,
    }

    const requestData = withdrawalType == Withdrawal_Type.AUTOMATIC ? AutomaticData : manualData

    await callApiHook({
      apiCall: callApproveWithdrawalApi(
        withdrawalApproveAdminApi(requestData)
      ),
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

        const formattedTransactions = response.payment_transaction.map(
          (transaction) => ({
            id: transaction.id,
            wallet_address: transaction?.wallet?.address,
            wallet_network: capitalize(transaction?.wallet?.blockchain),
            user_amount: transaction?.amount,
            total_amount: transaction?.wallet?.amount,
          })
        );

        const formattedWallets = response.wallets.map((wallet) => ({
          id: wallet.id,
          wallet_address: wallet.wallet_address,
          wallet_network: capitalize(wallet.blockchain),
          user_amount: wallet.amount,
          total_amount: wallet.amount, // Assuming total amount here refers to the same amount for wallets
        }));

        setWallets([...formattedTransactions, ...formattedWallets]);
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
    <DashboardPageWrapper>
      <ConfirmationModal
        handleClose={toggleConfirmModal}
        handleConfirm={handleConfirm}
        isOpen={confirmModal}
        confirmLoading={isApproveWithdrawalLoading}
        title="Withdrawal Confirmation"
      />
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Withdrawal Details</h2>
        </div>

        <ErrorApiText error={isWithdrawalDetailsError} />

        <LoadingApi loading={isWithdrawalDetailsLoading}>
          {user?.role == Role.USER && (
            <div className="detailspage mt-6">
              <div className="flex flex-col gap-4">
                <DetailsWrapper title={"Date"} align>
                  <TransparentInput
                    label={`Created At`}
                    value={moment(
                      withdrawalDetails?.withdrawal?.created_at
                    ).format("DD-MM-YYYY : hh:mm A")}
                  />

                  <TransparentInput
                    label={`Updated At`}
                    value={moment(
                      withdrawalDetails?.withdrawal?.updated_at
                    ).format("DD-MM-YYYY : hh:mm A")}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"ID"}>
                  <TransparentInput value={withdrawalDetails?.withdrawal?.id} />
                </DetailsWrapper>
                <DetailsWrapper title={"Source Amount"}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.requested_amount} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>

                {/* <DetailsWrapper title={"Gross Amount"}>
                  <TransparentInput value={`1 USD`} />
                </DetailsWrapper> */}
                <DetailsWrapper title={"Withdrawal Fee"}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.withdraw_fees} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Payment"}>
                  <TransparentInput
                    value={`1.0001 USD`}
                    label={"Payment Amount"}
                  />
                  <TransparentInput
                    value={`0 USDT`}
                    label={"Payment Amount Received"}
                  />
                </DetailsWrapper> */}

                <DetailsWrapper title={"Net Amount "}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.net_amount} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"Status"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.status}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"Wallet Address"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.recipient_address}
                    label={`${withdrawalDetails?.withdrawal?.unit} ${
                      withdrawalDetails?.withdrawal?.standard &&
                      `(${withdrawalDetails?.withdrawal?.standard})`
                    } Wallet Address`}
                  />
                  <TransparentInput
                    value={`${
                      withdrawalDetails?.withdrawal?.standard
                        ? withdrawalDetails?.withdrawal?.standard
                        : withdrawalDetails?.withdrawal?.unit
                    }`}
                    label={"Network"}
                  />
                </DetailsWrapper>

                <DetailsWrapper title={"Transaction Hash"}>
                  <TransparentInput
                    value={
                      withdrawalDetails?.withdrawal?.transaction_hash || "_"
                    }
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Profile"}>
                  <TransparentInput value={`Alphaspay`} />
                </DetailsWrapper> */}

                <DetailsWrapper title={"Notes"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.notes}
                    textarea
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Pass Through"}>
                  <TransparentInput value={`_`} textarea />
                </DetailsWrapper> */}

                {/* TABLES BELOW */}

                {/* <div className="data-grid-container">
                  <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Conversions</h2>
                  </div>

                  <DataGrid
                    rows={[]}
                    columns={converstion_table_columns}
                    className="font-semibold primary-color border-t-0"
                    hideFooter
                    autoHeight
                  />
                </div>

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
          )}

          {user?.role == Role.ADMIN && (
            <div className="detailspage mt-6">
              <div className="flex flex-col gap-4">
                <DetailsWrapper title={"Date"} align>
                  <TransparentInput
                    label={`Created At`}
                    value={moment(
                      withdrawalDetails?.withdrawal?.created_at
                    ).format("DD-MM-YYYY : hh:mm A")}
                  />

                  <TransparentInput
                    label={`Updated At`}
                    value={moment(
                      withdrawalDetails?.withdrawal?.updated_at
                    ).format("DD-MM-YYYY : hh:mm A")}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"ID"}>
                  <TransparentInput value={withdrawalDetails?.withdrawal?.id} />
                </DetailsWrapper>
                <DetailsWrapper title={"Source Amount"}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.requested_amount} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>

                {/* <DetailsWrapper title={"Gross Amount"}>
                  <TransparentInput value={`1 USD`} />
                </DetailsWrapper> */}
                <DetailsWrapper title={"Withdrawal Fee"}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.withdraw_fees} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>
                {/* <DetailsWrapper title={"Payment"}>
                  <TransparentInput
                    value={`1.0001 USD`}
                    label={"Payment Amount"}
                  />
                  <TransparentInput
                    value={`0 USDT`}
                    label={"Payment Amount Received"}
                  />
                </DetailsWrapper> */}

                <DetailsWrapper title={"Net Amount "}>
                  <TransparentInput
                    value={`${withdrawalDetails?.withdrawal?.net_amount} ${withdrawalDetails?.withdrawal?.unit}`}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"Status"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.status}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"Wallet Address"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.recipient_address}
                    label={`${withdrawalDetails?.withdrawal?.unit} ${
                      withdrawalDetails?.withdrawal?.standard &&
                      `(${withdrawalDetails?.withdrawal?.standard})`
                    } Wallet Address`}
                  />
                  <TransparentInput
                    value={`${
                      withdrawalDetails?.withdrawal?.standard
                        ? withdrawalDetails?.withdrawal?.standard
                        : withdrawalDetails?.withdrawal?.unit
                    }`}
                    label={"Network"}
                  />
                </DetailsWrapper>
                <DetailsWrapper title={"Notes"}>
                  <TransparentInput
                    value={withdrawalDetails?.withdrawal?.notes}
                    textarea
                  />
                </DetailsWrapper>

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
                  variant={"text"}
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
          )}
        </LoadingApi>
      </div>
    </DashboardPageWrapper>
  );
};

export default WithdrawalDetails;
