export const withdrawalsList_table_columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "createdAt", headerName: "Created At", flex: 1 },
  { field: "sourceAmount", headerName: "Source Amount", flex: 1 },
  { field: "netAmount", headerName: "Net Amount", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "walletAddress", headerName: "Wallet Address", flex: 1 },
  { field: "profile", headerName: "Profile", flex: 1 },
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
    type: "number",
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
    type: "number",
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
