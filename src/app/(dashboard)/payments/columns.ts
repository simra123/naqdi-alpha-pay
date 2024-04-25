export const paymentsList_table_columns = [
  { field: "createdAt", headerName: "Created At", flex: 1 },
  { field: "updatedAt", headerName: "Updated At", flex: 1 },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    flex: 1,
  },
  { field: "amountPaid", headerName: "Amount Paid", flex: 1 },
  { field: "paid", headerName: "Paid", flex: 1 },
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

export const relatedTransactions_table_columns = [
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    editable: true,
  },
  {
    field: "received",
    headerName: "Received",
    flex: 1,
    editable: true,
  },
  {
    field: "blockchain_transaction_hash",
    headerName: "Blockchain Transaction Hash",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    sortable: false,
    flex: 1,
  },
  {
    field: "network",
    headerName: "Network",
    sortable: false,
    flex: 1,
  },
  {
    field: "confirmed",
    headerName: "Confirmed",
    sortable: false,
    flex: 1,
  },
];

export const relatedPayments_table_columns = [
  {
    field: "created_at",
    headerName: "Created At",
    flex: 1,
    editable: true,
  },
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    editable: true,
  },
  {
    field: "requested_amount",
    headerName: "Requested Amount",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "payment_amount",
    headerName: "Amount",
    sortable: false,
    flex: 1,
  },
  {
    field: "payment_amount_received",
    headerName: "Payment Amount Received",
    sortable: false,
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
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
