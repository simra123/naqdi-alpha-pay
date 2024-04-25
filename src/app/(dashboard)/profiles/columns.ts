export const profilesList_table_columns = [
  { field: "createdAt", headerName: "Created At", flex: 1 },
  { field: "profileName", headerName: "Profile Name", flex: 1 },
  { field: "webhookUrl", headerName: "Webhook URL", flex: 1 },
  {
    field: "currencyConfiguration",
    headerName: "Currency Configuration",
    flex: 1,
  },
];

const rows = [
  {
    id: 1,
    createdAt: "2024-04-18",
    profileName: "Profile A",
    webhookUrl: "https://example.com/webhook",
    currencyConfiguration: "USD",
  },
  // Add more rows here if needed
];
