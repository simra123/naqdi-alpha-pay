export const wallet_table_columns = [
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "network", headerName: "Network", flex: 1 },
  { field: "totalAmount", headerName: "Available Balance", flex: 1 },
];

export const transactionsList_table_columns = [
  { field: "dateReceived", headerName: "Date Received", flex: 1 },
  { field: "transactionHash", headerName: "Transaction Hash", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 1 },
  // {
  //   field: "sourceWalletAddress",
  //   headerName: "Source Wallet Address",
  //   flex: 1,
  // },
  { field: "receiveAddress", headerName: "Receive Address", flex: 1 },
  { field: "transactionType", headerName: "Transacion Type", flex: 1 },
  { field: "network", headerName: "Network", flex: 1 },
  { field: "blockchain", headerName: "Blockchain", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];
