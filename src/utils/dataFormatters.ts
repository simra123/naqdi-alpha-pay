import moment from "moment";
import { roundToPrecision } from "./math";
import {
  blockchain_standards,
  blockchain_units,
  standardBlockchain,
  tickerByStandard,
  unitName,
} from "@/constants/blockchains";
import { BlockchainBalance } from "@/constants/types";

export const capitalize = (value) => {
  if (typeof value == "number") {
    return value;
  }
  return value
    ? value?.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : "";
};

export const removeBrackets = (value) => {
  return value.replace(/^\((.*?)\)$/, "$1").trim();
};

export const formattedBlockchainName = (value) => {
  let [ticker, standard] = value?.split(" ");
  let blockchain;

  if (standard) {
    standard = removeBrackets(standard);
    blockchain = tickerByStandard[standard];
  }
  return {
    name: unitName[ticker?.toLowerCase()],
    ticker: ticker,
    standard: standard,
    standardBlockchain: standardBlockchain[standard],
  };
};

export const formatBalanceForUser = (balance: []) => {
  const tableData = balance.map(
    (
      item: {
        unit: string;
        totalAmount: number;
        transactionTotal: number;
        paymentTransactionTotal: number;
      },
      index
    ) => {
      return {
        id: index,
        currency: item?.unit,
        totalAmount: roundToPrecision(+item?.totalAmount, 8),
        transactionTotal: roundToPrecision(+item?.transactionTotal, 8),
        paymentTransactionTotal: roundToPrecision(
          +item?.paymentTransactionTotal,
          8
        ),
      };
    }
  );

  return tableData;
};

export const formatBalanceForAdmin = (balance: []) => {
  const tableData = [];
  balance?.forEach((item: any) => {
    const data = {
      id: item?.blockchain,
      network: capitalize(item?.network),
      currency: capitalize(item?.blockchain),
      totalAmount: roundToPrecision(+item?.totalAmount, 10),
    };
    tableData.push(data);

    for (let currency in item?.tokens) {
      if (item?.tokens.hasOwnProperty(currency)) {
        tableData.push({
          id: item?.blockchain + currency,
          network: capitalize(item?.network),
          currency: capitalize(currency),
          totalAmount: roundToPrecision(+item?.tokens[currency], 10),
        });
      }
    }
  });

  return tableData;
};

export const formatTransactions = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    uuid:
      item?.payment_transaction_uuid ||
      item?.withdraw_transaction_uuid ||
      item?.transaction_uuid,
    dateReceived: item?.createdAt,
    transactionHash: item?.transaction_hash,
    amount:
      item?.unit != null
        ? `${item?.transaction_amount || item?.amount} ${item?.unit}`
        : item?.transaction_amount || item?.amount,
    receiveAddress:
      item?.withdrawal?.recipient_address ||
      item?.wallet?.wallet_address ||
      item?.wallet?.address,
    transactionType: capitalize(
      item?.payment?.id
        ? "Payment"
        : item?.withdrawal?.id
        ? "Withdrawal"
        : "Self Deposit"
    ),
    network: capitalize(item?.wallet?.network),
    blockchain: capitalize(
      item?.wallet?.blockchain || item?.clientWallet?.blockchain
    ),
    client_fee: item?.client_fee || "_",
    status: capitalize(item?.status),
  }));
  return tableData;
};

export const formatTransactionsByAdmin = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    uuid:
      item?.payment_transaction_uuid ||
      item?.withdraw_transaction_uuid ||
      item?.transaction_uuid,
    dateReceived: item?.createdAt,
    userName: item?.userDetails?.user?.username,
    email: item?.userDetails?.user?.email,
    transactionHash: item?.transaction_hash,
    amount:
      item?.unit != null
        ? `${item?.transaction_amount || item?.amount} ${item?.unit}`
        : item?.transaction_amount || item?.amount,
    receiveAddress:
      item?.withdrawal?.recipient_address ||
      item?.wallet?.wallet_address ||
      item?.wallet?.address,
    transactionType: capitalize(
      item?.payment?.id
        ? "Payment"
        : item?.withdrawal?.id
        ? "Withdrawal"
        : "Self Deposit"
    ),
    client_fee: item?.client_fee || "_",
    network: capitalize(item?.wallet?.network),
    blockchain: capitalize(
      item?.wallet?.blockchain || item?.clientWallet?.blockchain
    ),
    status: capitalize(item?.status),
  }));
  return tableData;
};

export const formatUsers = (response: []) => {
  const tableData = response?.map((item: any) => ({
    created_at: item?.created_at,
    email: item?.email,
    first_name: item?.first_name,
    id: item?.id,
    user_uuid: item?.user_uuid,
    last_name: item?.last_name,
    legal_name: item?.legal_name,
    legal_type: capitalize(item?.legal_type),
    middle_name: item?.middle_name,
    updated_at: item?.updated_at,
    user_type: capitalize(item?.user_type),
    username: item?.username,
    verified: item?.verified,
  }));
  return tableData;
};

export const formatWithdrawals = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    uuid: item?.withdrawal_uuid,
    created_at: item?.created_at,
    updated_at: item?.updated_at,
    requested_amount: item?.requested_amount,
    blockchain: `${item?.unit}${item?.standard ? `(${item?.standard})` : ""}`,
    unit: item?.unit,
    standard: item?.standard,
    withdrawal_type: capitalize(item?.transaction_type),
    transaction_hash: item?.transaction_hash || "_",
    recipient_address: item?.recipient_address,
    status: capitalize(item?.status),
  }));
  return tableData;
};

export const formatPayouts = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    uuid: item?.payout_uuid,
    created_at: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
    updated_at: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
    requested_amount: `${item?.requested_amount} ${item?.from_currency}`,
    account_title: item?.account_title,
    account_number: item?.account_no,
    from_currency: item?.from_currency,
    to_currency: item?.to_currency,
    status: capitalize(item?.status),
  }));
  return tableData;
};

// Webhooks Data Formatters
export const mergeWebhookResponses = (data) => {
  return data // Merge all webhook arrays
    .sort(
      (a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()
    ); // Sort by date (newest first)
};

export const filterWebhooks = (data: {
  webhooks: any[];
  filterType: "all" | "success" | "failed";
}) => {
  if (data.filterType === "success") {
    return data.webhooks.filter((webhook) => webhook.statusCode < 400);
  } else if (data.filterType === "failed") {
    return data.webhooks.filter((webhook) => webhook.statusCode >= 400);
  }
  return data.webhooks;
};

export const getWebhookPayloadById = (webhooks, id) => {
  const webhook = webhooks.find((w) => w.id === id);
  return webhook ? webhook : null;
};

export const getWalletData = (asset: BlockchainBalance) => {
  let isToken = asset?.is_token || asset?.isToken;
  let blockchainName = asset?.blockchainName || asset?.blockchain;
  let unit = isToken
    ? asset.unit
    : blockchain_units[blockchainName]?.toUpperCase();

  let standard = isToken ? asset?.standard : blockchain_standards[unit];
  let coinName = unitName[unit?.toLowerCase()];
  let currencyHistoryData = asset?.historyData;

  let amount = asset?.total_available_amount || asset?.amount;

  return {
    isToken,
    unit,
    standard,
    coinName,
    amount,
    currencyHistoryData,
    blockchainName,
  };
};
