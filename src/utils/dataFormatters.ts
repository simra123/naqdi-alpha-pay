import moment from "moment";
import { roundToPrecision } from "./math";

export const capitalize = (value) => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
};

export const formatBalanceForAdmin = (
  coins: { network: string; blockchain: string; confirmedBalance: string }[],
  tokens: {
    symbol: string;
    type: string;
    amount: string;
    identifier: string;
    network: string;
  }[]
) => {
  const tableData = [];
  const uniqueTokens = {};

  coins.forEach((item, index) => {
    const data = {
      id: index,
      network: capitalize(item?.network),
      // wallet_address: item?.wallet_address,
      currency: capitalize(item?.blockchain),
      totalAmount: roundToPrecision(+item?.confirmedBalance, 10),
    };
    tableData.push(data);
  });

  for (const token of tokens) {
    const key = `${token.symbol}/${token.type}`;
    const totalAmount = parseFloat(token.amount);

    if (uniqueTokens[key]) {
      uniqueTokens[key] = {
        ...uniqueTokens[key],
        totalAmount: roundToPrecision(
          uniqueTokens[key].totalAmount + totalAmount,
          10
        ),
      };
    } else {
      uniqueTokens[key] = {
        ...uniqueTokens[key],
        totalAmount: roundToPrecision(totalAmount, 10),
        id: token?.identifier,
        network: capitalize(token?.network),
        wallet_address: token?.identifier,
        currency: `${capitalize(token?.symbol)}(${token?.type})`,
      };
    }
  }

  for (const [key, value] of Object?.entries(uniqueTokens)) {
    tableData?.push(value);
  }

  return tableData;
};

export const formatBalanceForUser = (balance: []) => {
  const tableData = [];
  balance?.forEach((item: any) => {
    const data = {
      id: item?.id,
      network: capitalize(item?.network),
      wallet_address: item?.wallet_address,
      currency: capitalize(item?.blockchain),
      totalAmount: roundToPrecision(+item?.amount, 10),
    };
    tableData.push(data);
    for (let currency in item?.tokens) {
      if (item?.tokens.hasOwnProperty(currency)) {
        tableData.push({
          id: item?.id + currency,
          network: capitalize(item?.network),
          wallet_address: item?.wallet_address,
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
    dateReceived: moment(item?.createdAt).format("DD-MM-YYYY"),
    transactionHash: item?.transaction_hash,
    amount: item?.unit != null ? `${item?.amount} ${item?.unit}` : item?.amount,
    receiveAddress: item?.wallet?.wallet_address,
    transactionType: capitalize(item?.transaction_type),
    network: capitalize(item?.wallet?.network),
    blockchain: capitalize(item?.wallet?.blockchain),
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
