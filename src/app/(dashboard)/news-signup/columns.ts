export const payoutsList_table_columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "created_at", headerName: "Date", flex: 1 },
  { field: "from_currency", headerName: "From Currency", flex: 1 },
  { field: "to_currency", headerName: "To Currency", flex: 1 },
  { field: "requested_amount", headerName: "Requested Amount", flex: 1 },
  { field: "account_title", headerName: "Account Title", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

export const webhooks_table_columns = [
  {
    field: "info",
    headerName: "Info",
    flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",

    flex: 1,
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
