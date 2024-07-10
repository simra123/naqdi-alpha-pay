export const withdrawalsList_table_columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "created_at", headerName: "Created At", flex: 1 },
  { field: "updated_at", headerName: "Updated At", flex: 1 },
  { field: "requested_amount", headerName: "Requested Amount", flex: 1 },
  { field: "withdrawal_type", headerName: "Withdrawal Type", flex: 1 },
  { field: "network", headerName: "Network", flex: 1 },
  { field: "transaction_hash", headerName: "Transaction Hash", flex: 1 },
  { field: "recipient_address", headerName: "Recipient Address", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

export const converstion_table_columns = [
  {
    field: "created_at",
    headerName: "Created At",
    flex: 1,
    editable: true,
  },
  {
    field: "reference",
    headerName: "Reference",
    flex: 1,
    editable: true,
  },
  {
    field: "amount_converted",
    headerName: "Amount Converted",

    flex: 1,
    editable: true,
  },
  {
    field: "amount_credited",
    headerName: "Amount Credited",
    sortable: false,
    flex: 1,
  },
];

export const availableWallets_table_columns = [
  {
    field: "wallet_address",
    headerName: "Wallet Address",
    flex: 1,
  },
  {
    field: "wallet_network",
    headerName: "Network",
    flex: 1,
  },
  {
    field: "user_amount",
    headerName: "User Amount",

    flex: 1,
  },
  {
    field: "total_amount",
    headerName: "Total Amount",
    flex: 1,
  },
];

export const webhooks_table_columns = [
  {
    field: "info",
    headerName: "Info",
    flex: 1,
    editable: true,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",

    flex: 1,
    editable: true,
  },
  {
    field: "successful",
    headerName: "Successful",
    sortable: false,
    flex: 1,
  },
  {
    field: "retries",
    headerName: "Retries",
    sortable: false,
    flex: 1,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
  },
];
