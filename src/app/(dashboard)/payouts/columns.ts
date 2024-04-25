export const payoutsList_table_columns = [
  { field: "createdAt", headerName: "Created At", flex: 1 },
  { field: "payoutId", headerName: "Payout ID", flex: 1 },
  { field: "grossAmount", headerName: "Gross Amount", flex: 1 },
  { field: "toBankAccount", headerName: "To Bank Account", flex: 1 },
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
