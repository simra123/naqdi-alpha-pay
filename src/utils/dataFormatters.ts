import moment from "moment";
import { roundToPrecision } from "./math";

export const capitalize = (value) => {
  if (typeof value == "number") {
    return value;
  }
  return value ? value?.charAt(0).toUpperCase() + value.slice(1) : "";
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
    dateReceived: moment(item?.createdAt).format("DD-MM-YYYY : hh:mm A"),
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
    dateReceived: moment(item?.createdAt).format("DD-MM-YYYY : hh:mm A"),
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
    created_at: moment(item?.created_at).format("DD-MM-YYYY"),
    email: item?.email,
    first_name: item?.first_name,
    id: item?.id,
    user_uuid: item?.user_uuid,
    last_name: item?.last_name,
    legal_name: item?.legal_name,
    legal_type: capitalize(item?.legal_type),
    middle_name: item?.middle_name,
    updated_at: moment(item?.updated_at).format("DD-MM-YYYY"),
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
    created_at: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
    updated_at: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
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
