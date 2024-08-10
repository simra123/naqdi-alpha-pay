import moment from "moment";
import { roundToPrecision } from "./math";

export const capitalize = (value) => {
  if (typeof value == "number") {
    return value;
  }
  return value ? value?.charAt(0).toUpperCase() + value.slice(1) : "";
};

// export const formatBalanceForAdmin = (
//   coins: { network: string; blockchain: string; confirmedBalance: string }[],
//   tokens: {
//     symbol: string;
//     type: string;
//     amount: string;
//     identifier: string;
//     network: string;
//   }[]
// ) => {
//   const tableData = [];
//   const uniqueTokens = {};

//   coins.forEach((item, index) => {
//     const data = {
//       id: index,
//       network: capitalize(item?.network),
//       // wallet_address: item?.wallet_address,
//       currency: capitalize(item?.blockchain),
//       totalAmount: roundToPrecision(+item?.confirmedBalance, 10),
//     };
//     tableData.push(data);
//   });

//   for (const token of tokens) {
//     const key = `${token.symbol}/${token.type}`;
//     const totalAmount = parseFloat(token.amount);

//     if (uniqueTokens[key]) {
//       uniqueTokens[key] = {
//         ...uniqueTokens[key],
//         totalAmount: roundToPrecision(
//           uniqueTokens[key].totalAmount + totalAmount,
//           10
//         ),
//       };
//     } else {
//       uniqueTokens[key] = {
//         ...uniqueTokens[key],
//         totalAmount: roundToPrecision(totalAmount, 10),
//         id: token?.identifier,
//         network: capitalize(token?.network),
//         wallet_address: token?.identifier,
//         currency: `${capitalize(token?.symbol)}(${token?.type})`,
//       };
//     }
//   }

//   for (const [key, value] of Object?.entries(uniqueTokens)) {
//     tableData?.push(value);
//   }

//   return tableData;
// };

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
  // balance?.forEach((item: any) => {
  //   const data = {
  //     id: item?.id,
  //     network: capitalize(item?.network),
  //     wallet_address: item?.wallet_address,
  //     currency: capitalize(item?.blockchain),
  //     totalAmount: roundToPrecision(+item?.amount, 10),
  //   };
  //   tableData.push(data);
  //   for (let currency in item?.tokens) {
  //     if (item?.tokens.hasOwnProperty(currency)) {
  //       tableData.push({
  //         id: item?.id + currency,
  //         network: capitalize(item?.network),
  //         wallet_address: item?.wallet_address,
  //         currency: capitalize(currency),
  //         totalAmount: roundToPrecision(+item?.tokens[currency], 10),
  //       });
  //     }
  //   }
  // });

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
    dateReceived: moment(item?.createdAt).format("DD-MM-YYYY"),
    transactionHash: item?.transaction_hash,
    amount:
      item?.unit != null
        ? `${item?.transaction_amount} ${item?.unit}`
        : item?.transaction_amount,
    receiveAddress: item?.wallet?.wallet_address || item?.wallet?.address,
    transactionType: capitalize(item?.payment?.id ? "Payment" : "Self Deposit"),
    network: capitalize(item?.wallet?.network),
    blockchain: capitalize(item?.wallet?.blockchain),
    status: capitalize(item?.status),
  }));
  return tableData;
};

export const formatTransactionsByAdmin = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    dateReceived: moment(item?.createdAt).format("DD-MM-YYYY"),
    userName: item?.userDetails?.user?.username,
    email: item?.userDetails?.user?.email,
    transactionHash: item?.transaction_hash,
    amount:
      item?.unit != null
        ? `${item?.transaction_amount} ${item?.unit}`
        : item?.transaction_amount,
    receiveAddress: item?.wallet?.wallet_address || item?.wallet?.address,
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

export const formatWithdrawals = (response: []) => {
  const tableData = response?.map((item: any) => ({
    id: item?.id,
    created_at: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
    updated_at: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
    requested_amount: item?.requested_amount,
    network: `${item?.unit}${item?.standard && `(${item?.standard})`}`,
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
    created_at: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
    updated_at: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
    requested_amount: item?.requested_amount,
    account_title: item?.account_title,
    account_name: item?.account_name,
    from_currency: item?.from_currency,
    to_currency: item?.to_currency,
    status: capitalize(item?.status),
  }));
  return tableData;
};
