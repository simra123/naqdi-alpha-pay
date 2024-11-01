import { TableColumns } from "@/constants/types";
import moment from "moment";

export const withdrawalsList_table_columns = [
  { field: "id", headerName: "ID" },
  { field: "created_at", headerName: "Created At" },
  { field: "updated_at", headerName: "Updated At" },
  { field: "requested_amount", headerName: "Requested Amount" },
  { field: "withdrawal_type", headerName: "Withdrawal Type" },
  { field: "network", headerName: "Network" },
  { field: "transaction_hash", headerName: "Transaction Hash" },
  { field: "recipient_address", headerName: "Recipient Address" },
  { field: "status", headerName: "Status" },
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

export const availableWallets_table_columns: TableColumns = [
  {
    field: "wallet_uuid",
    headerName: "ID",
    dataValidator(value, row: { wallet_uuid: string; id: number }) {
      return row?.wallet_uuid || row?.id;
    },
  },
  { field: "currency", headerName: "Currency" },
  { field: "blockchain", headerName: "Blockchain" },
  { field: "amount", headerName: "Available Balance" },
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
