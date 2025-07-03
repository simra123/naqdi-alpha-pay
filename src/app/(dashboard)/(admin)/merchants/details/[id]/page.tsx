"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  getAllMerchantTransactionsAndBalanceByAdminApi,
  getUserDetailsApi,
} from "@/services/admin/users";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";

import { FolderIcon, StatusIcon } from "@/assets/Svgs";
import Details from "@/components/common/Details";
import { MdOutlineContactMail, MdOutlineLocationOn } from "react-icons/md";
import CustomTable from "@/components/common/CustomTable";
import {
  AccessLevelEnum,
  ModulesEnum,
  TableColumns,
  TransactionType,
} from "@/constants/types";
import { unitName } from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";
import { getMerchantTransactionByIdApi } from "@/services/admin/transaction";
import { hasMinAccess } from "@/utils/cookies";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import { formatDateToUserTimeZone } from "@/utils/dates";
import Chip from "@/components/common/Chip";
import { useRouter } from "next/navigation";
import CustomTableV2 from "@/components/common/CustomTableV2";
import AmountFormat from "@/components/common/AmountFormat";

const BalanceColumns: TableColumns = [
  {
    field: "totalUSD",
    headerName: "Current Balance",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "totalDeposit",
    headerName: "Total Deposit",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
  {
    field: "totalWithdrawal",
    headerName: "Total Withdrawal",
    dataValidator(value, row) {
      return <AmountFormat amount={value} type="fiat" />;
    },
  },
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
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

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

  const getMerchantTransactions = async ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => {
    await callApiHook({
      apiCall: callMerchantTransactionsApi(
        getAllMerchantTransactionsAndBalanceByAdminApi({
          companyId: userDetails?.user?.company?.id,
          limit,
          page,
        })
      ),
      successCallBack: (response) => {
        setmerchantTransactions(response);
      },
    });
  };

  useEffect(() => {
    getUserDetailsAdmin();
  }, []);

  useEffect(() => {
    if (userDetails?.user?.company?.id) {
      getMerchantTransactions({ limit: pageSize, page });
    }
  }, [viewMode, userDetails]);

  const transactionsList_Admin_table_columns: TableColumns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "created_at",
      headerName: "Date Received",
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
    {
      field: "transaction_request.contract_address.is_token",
      headerName: "Currency Type",
      dataValidator(value, row) {
        return value ? "Token" : "Coin";
      },
    },
    { field: "transaction_request.unit", headerName: "Currency" },
    {
      field: "transaction_request.contract_address.blockchain_name",
      headerName: "Blockchain",
    },
    {
      field: "hash",
      headerName: "Transaction Hash",
      link: (row: any) => {
        const transactionExplorerLink = showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain:
            row?.transaction_request?.contract_address?.blockchain_name,
          type: "hash",
          hash: row?.hash,
        });
        return transactionExplorerLink;
      },
    },
    {
      field: "paid_amount",
      headerName: "Received Amount",
      dataValidator(value, row: any) {
        return (
          <AmountFormat type="crypto" amount={value} currency={row?.unit} />
        );
      },
    },
    {
      field: "fiat_paid_amount",
      headerName: "Fiat Received Amount",
      dataValidator(value, row: any) {
        return (
          <AmountFormat
            amount={value}
            type="fiat"
            currency={row?.transaction_request?.fiat_currency}
          />
        );
      },
    },
    {
      field: "fee",
      headerName: "Fee Amount",
      dataValidator(value, row: any) {
        return (
          <AmountFormat type="crypto" amount={value} currency={row?.unit} />
        );
      },
    },
    {
      field: "fiat_fee",
      headerName: "Fiat Fee Amount",
      dataValidator(value, row: any) {
        return (
          <AmountFormat
            amount={value}
            type="fiat"
            currency={row?.transaction_request?.fiat_currency}
          />
        );
      },
    },
    {
      field: "net_amount",
      headerName: "Received Net Amount",
      dataValidator(value, row: any) {
        return (
          <AmountFormat type="crypto" amount={value} currency={row?.unit} />
        );
      },
    },
    {
      field: "fiat_net_amount",
      headerName: "Received Fiat Net Amount ",
      dataValidator(value, row: any) {
        return (
          <AmountFormat
            amount={value}
            type="fiat"
            currency={row?.transaction_request?.fiat_currency}
          />
        );
      },
    },

    {
      field: "sender_address",
      headerName: "Sender Address",
      copyable: true,
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain:
            row?.transaction_request?.contract_address?.blockchain_name,
          type: "address",
          address: row?.sender_address,
        });
      },
    },
    {
      field: "transaction_request.wallet.address",
      headerName: "Receiver Address",
      copyable: true,
      dataValidator(value, row: any) {
        return value || row?.transaction_request?.recipient_address;
      },
      link: (row: any) => {
        return showExplorerDetailsByChain({
          env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
          blockchain:
            row?.transaction_request?.contract_address?.blockchain_name,
          type: "address",
          address:
            row?.transaction_request?.recipient_address ||
            row?.transaction_request?.wallet?.address,
        });
      },
    },
    {
      field: "transaction_request.type",
      headerName: "Transaction Type",
      link(row: any) {
        if (
          row?.transaction_request?.type == TransactionType.Deposit &&
          hasMinAccess(ModulesEnum.payment, AccessLevelEnum.read)
        ) {
          return `/deposits/details/${row?.transaction_request?.id}`;
        }
        if (
          row?.transaction_request?.type == TransactionType.Withdraw &&
          hasMinAccess(ModulesEnum.withdrawal, AccessLevelEnum.read)
        ) {
          return `/withdrawals/details/${row?.transaction_request?.id}`;
        }
      },
      target: "_self",
    },
    {
      field: "status",
      headerName: "Status",
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
              value={
                userDetails?.user?.company?.fee
                  ? userDetails?.user?.company?.fee + "%"
                  : "Unset"
              }
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
              Summary
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

          <CustomTableV2
            loading={isMerchantTransactionsLoading}
            actions={<></>}
            tableWrapperClassName="!min-h-[auto]"
            columns={
              viewMode == ViewMode.BALANCES
                ? BalanceColumns
                : transactionsList_Admin_table_columns
            }
            rows={
              viewMode == ViewMode.BALANCES
                ? [{ id: 1, ...merchantTransactions?.wallet }]
                : merchantTransactions?.transacitons?.result || []
            }
            tableName="transactions"
            rowClickHandler={(row: any) => {
              router.push(`/transactions/details/${row?.id}`);
            }}
            totalItems={merchantTransactions?.transacitons?.total}
            columnClassName="max-w-[250px]"
            serverSidePagination
            pagination={viewMode == ViewMode.TRANSACTIONS}
            initialPageSize={pageSize}
            onPageChange={(page) => {
              setPage(page);
              getMerchantTransactions({ limit: pageSize, page });
            }}
            onPageSizeChange={(pageSize) => {
              setPageSize(pageSize);
              setPage(1);
              getMerchantTransactions({ limit: pageSize, page: 1 });
            }}
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
