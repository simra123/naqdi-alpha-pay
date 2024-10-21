"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { listApiKeysApi, revokeKeyApi } from "@/services/Integration";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";

import { getWebhookURLAPI } from "@/services/Integration";
import LoaderButton from "@/components/common/LoaderButton";
import CustomTable from "@/components/common/CustomTable";
import CreateApiKeyModal from "@/components/Modals/CreateApiKeyModal";
import WebhookURLModal from "@/components/Modals/WebhookURLModal";
import { useSelector } from "react-redux";

const Integrations = () => {
  const [keysList, setKeysList] = useState([]);
  const user = useSelector((state: { user: any }) => state?.user?.data);
  const [webhookURL, setWebhookURL] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);

  console.log(user);

  const [
    iswebhookDetailsLoading,
    iswebhookDetailsError,
    callwebhookDetailsApi,
  ] = useApi({ initailLoading: true });
  const [isKeyListLoading, isKeyListError, callKeyListApi] = useApi({
    initailLoading: true,
  });
  const [isRevokeLoading, isRevokeError, callRevokeApi] = useApi();

  const columns = [
    { field: "user_secretKey_uuid", headerName: "ID" },

    { field: "createdAt", headerName: "Created At" },
    { field: "name", headerName: "Name" },
    { field: "apiKey", headerName: "API Key" },
    {
      field: "revoked",
      headerName: "Status",

      dataValidator: (id, row) => {
        return row.revoked ? "InActive" : "Active";
      },
    },
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

  const getwebhookDetails = async () => {
    await callApiHook({
      apiCall: callwebhookDetailsApi(getWebhookURLAPI()),
      successCallBack: (response) => {
        if (response && response?.length > 0) {
          setWebhookURL(response[0]?.webhook_url);
        }
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
            user_secretKey_uuid: item?.user_secretKey_uuid,
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
    getwebhookDetails();
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
        initialWebhookValue={webhookURL}
        refreshHandler={getwebhookDetails}
        toggleHandler={toggleWebhookModal}
      />
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        refreshHandler={callListApi}
        toggleHandler={toggleCreateModal}
      />
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 md:block hidden">
        Integrations
      </h3>

      <div className="rounded-medium bg-white p-6 md:p-10 mt-8">
        <div className="flex justify-between lg:items-center sm:items-start gap-y-6 lg:flex-row flex-col overflow-hidden text-ellipsis">
          <div className="flex flex-col gap-3 text-black-100">
            <h4 className="text-button sm:text-p122 font-semibold">
              Webhook URL
            </h4>
            <LoadingApi loading={iswebhookDetailsLoading}>
              <span className="font-medium max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
                {webhookURL}
              </span>
            </LoadingApi>
            <ErrorApiText error={iswebhookDetailsError} />
          </div>
          <LoaderButton
            content={"Update URL"}
            variant="outlined"
            onClick={toggleWebhookModal}
          />
        </div>
      </div>

      <div className="rounded-medium bg-white p-6 md:p-10 mt-8">
        <CustomTable
          tableWrapper={null}
          loading={isKeyListLoading}
          actions={
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-button sm:text-p122 font-semibold text-black-100">
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
          pagination
          rows={keysList}
          initialPageSize={10}
        />

        <ErrorApiText error={isKeyListError || isRevokeError} />
      </div>
    </>
  );
};

export default Integrations;
