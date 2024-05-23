"use client";
import React, { useEffect, useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  addWebhookURLAPI,
  generateApiKeyApi,
  listApiKeysApi,
} from "@/services/Integration";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";

import { userDetailsApi } from "@/services/user";

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

const Integrations = () => {
  const [keysList, setKeysList] = useState([]);
  const [webhookURL, setWebhookURL] = useState("");

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);
  const [isWebhookLoading, isWebhookError, callWebHookApi] = useApi();
  const [isKeyLoading, isKeyError, callNewKeyApi] = useApi();
  const [isKeyListLoading, isKeyListError, callKeyListApi] = useApi(true);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    // { field: "name", headerName: "Name", flex: 1 },
    // { field: "permissions", headerName: "Permissions", flex: 1 },
    // {
    //   field: "trustedIPAddresses",
    //   headerName: "Trusted IP Addresses",
    //   flex: 1,
    // },
    { field: "apiKey", headerName: "API Key", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    // { field: "expiresAt", headerName: "Expires At", flex: 1 },
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

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response) => {
        setWebhookURL(response?.userDetails?.user?.webhook?.webhook_url);
      },
    });
  };

  const handleGenerateNewApiKey = async () => {
    await callApiHook({
      apiCall: callNewKeyApi(generateApiKeyApi()),
      successCallBack: (response: any) => {
        console.log(response);
        callListApi();
      },
    });
  };

  const handleAddWebhookUrl = async () => {
    await callApiHook({
      apiCall: callWebHookApi(addWebhookURLAPI({ url: webhookURL })),
      successCallBack: (response: any) => {
        console.log(response);
      },
    });
  };

  const callListApi = async () => {
    await callApiHook({
      apiCall: callKeyListApi(listApiKeysApi()),
      successCallBack: (response: any) => {
        const tableData = response?.map((item) => {
          return {
            id: item?.id,
            apiKey: item?.secret_key,
            createdAt: moment(item?.created_at).format("DD-MM-YYYY"),
          };
        });
        setKeysList(tableData);
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWebhookURL(value);
  };

  useEffect(() => {
    getUserDetails();
    callListApi();
  }, []);

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
            <DetailsWrapper title={"Webhook URL"} align>
              <LoadingApi loading={isUserDetailsLoading}>
                <TransparentInput
                  value={webhookURL}
                  label="Add A Webhook where you want to receive update. Documentation"
                  inputClass="!w-[420px]"
                  disabled={false}
                  onChange={handleChange}
                />
              </LoadingApi>
              <ErrorApiText error={isUserDetailsError} />
            </DetailsWrapper>
            <ErrorApiText error={isWebhookError} />
            <div className="flex gap-1 justify-end  mt-3">
              {/* <Button variant="text" className="py-2 px-8" disabled>
                Reveal Token
              </Button> */}
              <LoadingApi loading={isWebhookLoading}>
                <Button
                  variant="outlined"
                  className="py-2 px-8"
                  onClick={handleAddWebhookUrl}
                >
                  Update URL
                </Button>
              </LoadingApi>
            </div>

            <ErrorApiText error={isKeyError} />
            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <div className="actions flex gap-3">
                  <LoadingApi loading={isKeyLoading}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleGenerateNewApiKey}
                    >
                      New API Key
                    </Button>
                  </LoadingApi>
                </div>
              </div>
              <LoadingApi loading={isKeyListLoading}>
                <DataGrid
                  rows={keysList}
                  columns={columns}
                  autoHeight
                  className="border-t-0 primary-color"
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
              </LoadingApi>
              <ErrorApiText error={isKeyListError} />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default Integrations;
