"use client";
import React from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Integrations = () => {
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "permissions", headerName: "Permissions", flex: 1 },
    {
      field: "trustedIPAddresses",
      headerName: "Trusted IP Addresses",
      flex: 1,
    },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "expiresAt", headerName: "Expires At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleRevoke(params.row.id)}
        >
          Revoke
        </Button>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: "User A",
      permissions: "Read, Write",
      trustedIPAddresses: "192.168.1.1, 10.0.0.1",
      createdAt: "2024-04-18",
      expiresAt: "2025-04-18",
    },
    // Add more rows here if needed
  ];

  const handleRevoke = (id: any) => {
    // Handle revoke action here
    console.log(`Revoke action triggered for ID: ${id}`);
  };
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Webhook Token"} align>
              <TransparentInput
                value={`********************`}
                label="Use this token to verify incoming webhooks. Documentation"
                inputClass="!w-[420px]"
              />
            </DetailsWrapper>

            <div className="flex gap-1 justify-end  mt-3">
              <Button variant="text" className="py-2 px-8" disabled>
                Reveal Token
              </Button>
              <Button variant="text" className="py-2 px-8" disabled>
                Regenerate Token
              </Button>
            </div>

            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <div className="actions flex gap-3">
                  <Button variant="text" color="primary" disabled>
                    New API Key
                  </Button>
                </div>
              </div>

              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                className="border-t-0 primary-color font-semibold"
                sx={{
                  ".MuiDataGrid-overlayWrapper": {
                    padding: "25px",
                  },
                  ".MuiDataGrid-overlayWrapperInner": {
                    height: "10px !important",
                  },
                }}
                sortingOrder={["asc", "desc"]}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default Integrations;
