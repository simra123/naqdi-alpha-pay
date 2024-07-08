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
import { getWithdrawalDetilsApi } from "@/services/withdrawal";

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
  const withdraw_id = +params?.id;

  const [withdrawalData, setWithdrawalData] = useState({
    transaction_hash: "",
  });

  const [confirmModal, setConfirmModal] = useState(false);

  const [withdrawalType, setWithdrawalType] = useState(Withdrawal_Type.MANUAL);

  const [selectionModel, setSelectionModel] = useState([]);

  const [withdrawalDetails, setwithdrawalDetails] = useState();
  const [
    isWithdrawalDetailsLoading,
    isWithdrawalDetailsError,
    callWithdrawalDetailsApi,
  ] = useApi(true);

  const getWithdrawalDetails = async () => {
    await callApiHook({
      apiCall: callWithdrawalDetailsApi(
        getWithdrawalDetilsApi({ withdraw_id })
      ),
      successCallBack: (response: any) => {
        setwithdrawalDetails(response);
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
    setWithdrawalData((pre) => ({ ...pre, transaction_hash: "" }));
    setSelectionModel([]);
    setWithdrawalType(type);
  };

  const handleConfirm = () => {
    toggleConfirmModal();
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  console.log(selectionModel, " Data");

  return (
    <DashboardPageWrapper>
      <ConfirmationModal
        handleClose={toggleConfirmModal}
        handleConfirm={handleConfirm}
        isOpen={confirmModal}
        title="Withdrawal Confirmation"
      />
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Withdrawal Details</h2>
        </div>

        {user?.role == Role.USER && (
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper title={"Date"} align>
                <TransparentInput
                  label={`Created At`}
                  value={`11 Feb 2024, 19:13:19`}
                />

                <TransparentInput
                  label={`Updated At`}
                  value={`11 Feb 2024, 19:13:19`}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"ID"} align>
                <TransparentInput
                  label={`ID`}
                  value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
            `}
                />
                <TransparentInput
                  label={`Reference`}
                  value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
            `}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Source Amount"}>
                <TransparentInput value={`2 USDT`} />
              </DetailsWrapper>

              <DetailsWrapper title={"Gross Amount"}>
                <TransparentInput value={`1 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Withdrawal Fee"}>
                <TransparentInput value={`0.01 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Payment"}>
                <TransparentInput
                  value={`1.0001 USD`}
                  label={"Payment Amount"}
                />
                <TransparentInput
                  value={`0 USDT`}
                  label={"Payment Amount Received"}
                />
              </DetailsWrapper>

              <DetailsWrapper title={"Net Amount "}>
                <TransparentInput value={`0 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Status"}>
                <TransparentInput value={`Pending`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Wallet Address"}>
                <TransparentInput
                  value={`0x0BE060762C1D69f04085646B8e285c3031741`}
                  label={"ETH Wallet Address "}
                />
                <TransparentInput value={`Eth`} label={"Network"} />
              </DetailsWrapper>

              <DetailsWrapper title={"Transaction Hash"}>
                <TransparentInput value={`_`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Profile"}>
                <TransparentInput value={`Alphaspay`} />
              </DetailsWrapper>

              <DetailsWrapper title={"Notes"}>
                <TransparentInput value={`Hellow`} textarea />
              </DetailsWrapper>
              <DetailsWrapper title={"Pass Through"}>
                <TransparentInput value={`_`} textarea />
              </DetailsWrapper>

              {/* TABLES BELOW */}

              <div className="data-grid-container">
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
              </div>
            </div>
          </div>
        )}

        {user?.role == Role.ADMIN && (
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper title={"Date"} align>
                <TransparentInput
                  label={`Created At`}
                  value={`11 Feb 2024, 19:13:19`}
                />

                <TransparentInput
                  label={`Updated At`}
                  value={`11 Feb 2024, 19:13:19`}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"ID"} align>
                <TransparentInput
                  value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
      `}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"Source Amount"}>
                <TransparentInput value={`2 USDT`} />
              </DetailsWrapper>

              <DetailsWrapper title={"Gross Amount"}>
                <TransparentInput value={`1 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Withdrawal Fee"}>
                <TransparentInput value={`0.01 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Net Amount "}>
                <TransparentInput value={`0.8 USD`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Status"}>
                <TransparentInput value={`Pending`} />
              </DetailsWrapper>
              <DetailsWrapper title={"Source Currency & Network"}>
                <TransparentInput value={`USDT`} label={"Currency"} />
                <TransparentInput value={`ERC-20`} label={"Network"} />
              </DetailsWrapper>
              <DetailsWrapper title={"Destination Currency & Network"}>
                <TransparentInput value={`Ethereum`} label={"Currency"} />
                <TransparentInput value={`ERC-20`} label={"Network"} />
              </DetailsWrapper>

              <DetailsWrapper title={"Recipient Wallet Address"}>
                <TransparentInput
                  value={`0x0BE060762C1D69f04085646B8e285c3031741`}
                  label={"Wallet Address "}
                />
                <TransparentInput value={`Eth`} label={"Network"} />
              </DetailsWrapper>

              <DetailsWrapper title={"Notes"}>
                <TransparentInput value={`Hellow`} textarea />
              </DetailsWrapper>
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
                    value={withdrawalData?.transaction_hash}
                    name="transaction_hash"
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
                  rows={dummyRows}
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
            <div className="flex gap-2 justify-center max-w-[75%] mb-7 mt-10 ">
              <Button variant="text" className="py-2 px-8">
                Reject
              </Button>
              <Button
                variant="outlined"
                className="py-2 px-8"
                onClick={toggleConfirmModal}
                disabled={
                  withdrawalData?.transaction_hash || selectionModel?.length
                    ? false
                    : true
                }
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardPageWrapper>
  );
};

export default WithdrawalDetails;
