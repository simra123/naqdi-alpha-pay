"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@mui/material";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  addWebhookURLAPI,
  generateApiKeyApi,
  listApiKeysApi,
  revokeKeyApi,
} from "@/services/Integration";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";

import { userDetailsApi } from "@/services/user";
import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import CreateApiKeyModal from "@/components/common/CreateApiKeyModal";
import WebhookURLModal from "@/components/common/WebhookURLModal";

const Integrations = () => {
  const [keysList, setKeysList] = useState([]);
  const [webhookURL, setWebhookURL] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);
  const [isKeyListLoading, isKeyListError, callKeyListApi] = useApi(true);
  const [isRevokeLoading, isRevokeError, callRevokeApi] = useApi();

  const columns = [
    { field: "id", headerName: "ID" },

    { field: "createdAt", headerName: "Created At" },
    { field: "name", headerName: "Name" },
    { field: "apiKey", headerName: "API Key" },
    {
      field: "revoked",
      headerName: "Actions",

      dataValidator: (id, row) => {
        return (
          <button
            onClick={(event) => handleRevoke(event, row)}
            className={`px-7 rounded-medium py-1 ${
              row.revoked
                ? "bg-yellow-chip-light text-yellow-light"
                : "bg-blue-table-button text-blue-table-button-text"
            }`}
          >
            {row.revoked ? "Enable" : "Revoke"}
          </button>
        );
      },
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

  const callListApi = async () => {
    await callApiHook({
      apiCall: callKeyListApi(listApiKeysApi()),
      successCallBack: (response: any) => {
        const tableData = response?.map((item) => {
          return {
            id: item?.id,
            apiKey: item?.secret_key,
            createdAt: moment(item?.created_at).format("DD-MM-YYYY"),
            revoked: item?.revoked,
            name: item?.name,
          };
        });
        setKeysList(tableData);
      },
    });
  };

  useEffect(() => {
    getUserDetails();
    callListApi();
  }, []);

  const handleRevoke = async (event: any, data: any) => {
    // Handle revoke action here
    event.stopPropagation();

    await callApiHook({
      apiCall: callRevokeApi(
        revokeKeyApi({ secretKeyId: data?.id, revoke: !data?.revoked })
      ),
      successCallBack: (response: any) => {
        callListApi();
      },
    });
    console.log(data);
    console.log(`Revoke action triggered for ID: ${data.id}`);
  };

  const toggleCreateModal = () => {
    setIsCreateOpen(!isCreateOpen);
  };
  const toggleWebhookModal = () => {
    setIsWebhookOpen(!isWebhookOpen);
  };

  return (
    <>
      <WebhookURLModal
        isOpen={isWebhookOpen}
        refreshHandler={getUserDetails}
        toggleHandler={toggleWebhookModal}
      />
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        refreshHandler={callListApi}
        toggleHandler={toggleCreateModal}
      />
      <h3 className="text-h3.5 font-semibold text-blackGrey-100">
        Integrations
      </h3>

      <div className="rounded-medium bg-white p-8 mt-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3 text-black-100">
            <h4 className="text-p122 font-semibold">Webhook URL</h4>
            {/* <LoadingApi loading={isUserDetailsLoading}> */}
            <span className="font-medium">{webhookURL}</span>
            {/* </LoadingApi> */}
            <ErrorApiText error={isUserDetailsError} />
          </div>
          <LoaderButton
            content={"Update URL"}
            variant="outlined"
            onClick={toggleWebhookModal}
          />
        </div>
      </div>

      <div className="rounded-medium bg-white p-4 mt-8">
        <LoadingApi loading={isKeyListLoading}>
          <CustomTable
            actions={
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-p122 font-semibold text-black-100">
                  API Keys
                </h2>

                <LoaderButton
                  variant="outlined"
                  content={"New API Key"}
                  className="w-48"
                  onClick={toggleCreateModal}
                />
              </div>
            }
            columns={columns}
            // Filters={Filters}
            rowClickHandler={(row) => console.log(row)}
            rows={keysList}
            initialPageSize={10}
          />
        </LoadingApi>
        <ErrorApiText error={isKeyListError || isRevokeError} />
      </div>
    </>
  );
};

export default Integrations;
