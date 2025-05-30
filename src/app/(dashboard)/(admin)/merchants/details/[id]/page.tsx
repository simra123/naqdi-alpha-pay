"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getUserDetailsApi } from "@/services/admin/users";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";

import { FolderIcon, StatusIcon } from "@/assets/Svgs";
import Details from "@/components/common/Details";
import { MdOutlineContactMail, MdOutlineLocationOn } from "react-icons/md";
import CustomTable from "@/components/common/CustomTable";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { unitName } from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";
import { getMerchantTransactionByIdApi } from "@/services/admin/transaction";
import { hasMinAccess } from "@/utils/cookies";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import { formatDateToUserTimeZone } from "@/utils/dates";
import Chip from "@/components/common/Chip";
import { useRouter } from "next/navigation";

const BalanceColumns: TableColumns = [
  { field: "id", headerName: "ID" },
  {
    field: "unit",
    headerName: "Currency",
    dataValidator(value, row: { standard: string | null }) {
      return row?.standard
        ? `${value} (${row?.standard})`
        : `${unitName[value.toLocaleLowerCase()]}`;
    },
  },
  { field: "amount", headerName: "Balance" },
];

enum ViewMode {
  TRANSACTIONS = "transactions",
  BALANCES = "balances",
}

const MerchantDetails = ({ params }) => {
  const userId = params?.id;
  const router = useRouter();
  const [userDetails, setUserDetails]: any = useState({});
  const [merchantTransactions, setmerchantTransactions]: any = useState([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.BALANCES);

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] = useApi(
    { initailLoading: true }
  );
  const [
    isMerchantTransactionsLoading,
    isMerchantTransactionsError,
    callMerchantTransactionsApi,
  ] = useApi();

  const getUserDetailsAdmin = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(getUserDetailsApi({ userId })),
      successCallBack: (response) => {
        setUserDetails(response);
      },
    });
  };
  const toggleViewMode = (mode: ViewMode) => setViewMode(mode);

  const getMerchantTransactions = async () => {
    await callApiHook({
      apiCall: callMerchantTransactionsApi(
        getMerchantTransactionByIdApi({ merchant_id: userId })
      ),
      successCallBack: (response) => {
        setmerchantTransactions(response?.data);
      },
    });
  };

  useEffect(() => {
    getUserDetailsAdmin();
  }, []);

  useEffect(() => {
    viewMode == ViewMode.TRANSACTIONS && getMerchantTransactions();
  }, [viewMode]);

  const transactionsList_Admin_table_columns: TableColumns = [
    {
      field: "uuid",
      headerName: "ID",
      sortable: true,
      dataValidator(value, row: any) {
        return row?.withdraw_transaction_uuid || row?.payment_transaction_uuid;
      },
    },
    {
      field: "createdAt",
      headerName: "Date Received",
      sortable: true,
      dataValidator: (value) => {
        let [day, time] = formatDateToUserTimeZone(value);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-caption">{day}</span>
            <span className="text-custom-title-gray text-subtitle">{time}</span>
          </div>
        );
      },
    },
    { field: "transaction_type", headerName: "Currency Type", sortable: true },
    { field: "unit", headerName: "Currency", sortable: true },
    {
      field: "blockchain",
      headerName: "Blockchain",
      sortable: true,
      dataValidator(value, row: any) {
        return row?.clientWallet?.blockchain || row?.wallet?.blockchain;
      },
    },
    {
      field: "transaction_hash",
      headerName: "Transaction Hash",
      sortable: true,
      link: (row: any) => {
        const transactionExplorerLink = showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.wallet?.blockchain || row?.clientWallet?.blockchain,
          type: "hash",
          hash: row?.transaction_hash,
        });
        return transactionExplorerLink;
      },
    },
    { field: "amount", headerName: "Amount", sortable: true },
    { field: "alphaspay_fees", headerName: "Fee", sortable: true },

    {
      field: "sender_address",
      headerName: "Sender Address",
      sortable: true,
      copyable: true,
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
          type: "address",
          address: row?.sender_address,
        });
      },
    },
    {
      field: "receiveAddress",
      headerName: "Receiver Address",
      sortable: true,
      copyable: true,
      dataValidator(value, row: any) {
        return row?.withdrawal?.recipient_address || row?.wallet?.address;
      },
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain: row?.clientWallet?.blockchain || row?.wallet?.blockchain,
          type: "address",
          address: row?.withdrawal?.recipient_address || row?.wallet?.address,
        });
      },
    },
    {
      field: "type",
      headerName: "Transaction Type",
      sortable: true,
      dataValidator(value, row: any) {
        return row?.payment ? "Deposit" : "Withdrawal";
      },
      link(row: any) {
        if (
          row?.payment &&
          hasMinAccess(ModulesEnum.transaction, AccessLevelEnum.read)
        ) {
          return `/deposits/details/${row?.payment?.id}`;
        }
        if (
          row?.withdrawal &&
          hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
        ) {
          return `/withdrawals/details/${row?.withdrawal?.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      dataValidator: (value) => {
        return <Chip status={value} />;
      },
    },
  ];

  return (
    <>
      <ErrorApiText error={isUserDetailsError} />
      <LoadingApi loading={isUserDetailsLoading}>
        <div className="flex flex-col">
          <h3 className="font-semibold text-blackGrey-100 text-h3.5">
            Merchant Details
          </h3>

          <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
            <FolderIcon />
            <h5 className="font-semibold text-h5 text-purple-500">General</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="ID" value={userDetails?.user_details_uuid} />
            <Details
              label="Created Date"
              value={moment(userDetails?.user?.created_at).format("DD-MM-YYYY")}
            />
            <Details label="First Name" value={userDetails?.user?.first_name} />
            <Details label="Last Name" value={userDetails?.user?.last_name} />
            <Details label="Legal Name" value={userDetails?.user?.legal_name} />
            <Details label="User Type" value={userDetails?.user?.user_type} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MdOutlineContactMail className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">Contacts</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="Phone" value={userDetails?.phone_number} />
            <Details label="Email" value={userDetails?.user?.email} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MdOutlineLocationOn className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">
              Addressess
            </h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="Address" value={userDetails?.address_line_1} />
            <Details label="Country" value={userDetails?.country} />
            <Details label="State" value={capitalize(userDetails?.state)} />
            <Details label="City" value={userDetails?.city} />
            <Details label="Postal Code" value={userDetails?.postal_code} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <StatusIcon />
            <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="Email Verified"
              value={userDetails?.user?.verified ? "Verified" : "Unverified"}
            />
            <Details
              label="MFA"
              value={userDetails?.mfa ? "Enabled" : "Disabled"}
            />

            <Details label="KYC" value={userDetails?.kyc_status} />
            <Details
              label="Fees"
              value={userDetails?.fees ? userDetails?.fees + "%" : "Unset"}
            />
          </div>
        </div>

        <div className="mt-16">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => toggleViewMode(ViewMode.BALANCES)}
              className={` font-semibold text-button rounded-small px-6 py-2 transition-all  ${
                viewMode === ViewMode.BALANCES
                  ? "bg-purple-gradient text-white"
                  : "hover:bg-purple-gradient hover:text-white"
              }`}
            >
              Balances
            </button>
            {hasMinAccess(ModulesEnum.transaction, AccessLevelEnum.read) && (
              <button
                onClick={() => toggleViewMode(ViewMode.TRANSACTIONS)}
                className={` font-semibold text-button rounded-small px-6 py-2 transition-all  ${
                  viewMode === ViewMode.TRANSACTIONS
                    ? "bg-purple-gradient text-white"
                    : "hover:bg-purple-gradient hover:text-white"
                }`}
              >
                Transactions
              </button>
            )}
          </div>

          <CustomTable
            columns={
              viewMode == ViewMode.BALANCES
                ? BalanceColumns
                : transactionsList_Admin_table_columns
            }
            pagination={viewMode == ViewMode.TRANSACTIONS}
            initialPageSize={5}
            rowClickHandler={(row: { id: string }) => {
              router.push(`/transactions/details/${row?.id}`);
            }}
            tableWrapperClassName="!min-h-[auto]"
            rows={
              viewMode == ViewMode.BALANCES
                ? userDetails?.user?.balances || []
                : merchantTransactions
            }
            actions={<></>}
            loading={isMerchantTransactionsLoading}
            columnClassName="max-w-[200px]"
          />
        </div>
        <ErrorApiText error={isMerchantTransactionsError} />
      </LoadingApi>
    </>
  );
};

export default PermissionAccess(
  MerchantDetails,
  ModulesEnum.merchant,
  AccessLevelEnum.read
);
