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
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import PermissionAccess from "@/middleware/PermissionAccess";
import IconField from "@/components/common/IconField";

const Integrations = () => {
  const [keysList, setKeysList] = useState([]);
  const user = useSelector((state: { user: any }) => state?.user?.data);
  const [webhookURL, setWebhookURL] = useState<any>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);


  const [
    iswebhookDetailsLoading,
    iswebhookDetailsError,
    callwebhookDetailsApi,
  ] = useApi({ initailLoading: true });
  const [isKeyListLoading, isKeyListError, callKeyListApi] = useApi({
    initailLoading: true,
  });
  const [isRevokeLoading, isRevokeError, callRevokeApi] = useApi();

  const columns: TableColumns = [
    { field: "user_secretKey_uuid", headerName: "ID" },

    { field: "createdAt", headerName: "Created At" },
    { field: "name", headerName: "Name" },
    { field: "apiKey", headerName: "API Key", copyable: true },
    {
      field: "revoked",
      headerName: "Status",

      dataValidator: (id, row: { revoked: boolean | null }) => {
        return row.revoked ? "InActive" : "Active";
      },
    },
    {
      field: "revoked",
      headerName: "Actions",

      dataValidator: (id, row: { revoked: boolean | null }) => {
        return (
          <button
            onClick={(event) => handleRevoke(event, row)}
            className={`px-7 rounded-medium py-1 ${row.revoked
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
          setWebhookURL(response[0]);
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
        initialWebhookValue={webhookURL?.webhook_url}
        refreshHandler={getwebhookDetails}
        toggleHandler={toggleWebhookModal}
      />
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        refreshHandler={callListApi}
        toggleHandler={toggleCreateModal}
      />
      <h3 className="hidden md:block font-semibold text-blackGrey-100 text-h3.5">
        Integrations
      </h3>

      <div className="mt-8 rounded-medium">
        <div className="flex lg:flex-row flex-col justify-between sm:items-start lg:items-center gap-y-6 overflow-hidden text-ellipsis">
          <div className="flex flex-col gap-3 text-black-100">
            <h4 className="font-semibold text-button sm:text-p122">
              Webhook
            </h4>


            <LoadingApi loading={iswebhookDetailsLoading}>
              <div className="flex items-center gap-3">

                <h4 className="w-16 font-semibold text-button sm:text-button">
                  URL
                </h4>
                <span className="max-w-[100%] overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                  {webhookURL?.webhook_url}
                </span>
              </div>
              <div className="flex items-center gap-3">

                {webhookURL?.secret && (<>
                  <h4 className="w-16 font-semibold text-button sm:text-button">
                    Secret
                  </h4>
                  <IconField type="password" inputClassName="!border-0 !p-0 font-medium flex-1 text-ellipsis" inputContainerClassName="flex gap-4" iconClassName="!static !block !ml-4" wrapperClassName="!m-0 !flex-1" onChange={() => {}} disabled value={webhookURL?.secret} />

                </>)}

              </div>
            </LoadingApi>
            <ErrorApiText error={iswebhookDetailsError} />
          </div>
          <>
            {PermissionAccess(
              LoaderButton,
              ModulesEnum.integration,
              AccessLevelEnum.full
            )({
              content: "Update URL",
              variant: "outlined",
              onClick: toggleWebhookModal,
            })}
          </>
        </div>
      </div>

      <div className="mt-8 rounded-medium">
        <CustomTable
          tableWrapper={null}
          loading={isKeyListLoading}
          actions={
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-black-100 text-button sm:text-p122">
                API Keys
              </h2>

              <>
                {PermissionAccess(
                  LoaderButton,
                  ModulesEnum.integration,
                  AccessLevelEnum.full
                )({
                  variant: "outlined",
                  content: "New API Key",
                  className: "w-48",
                  onClick: toggleCreateModal,
                })}
              </>
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

export default PermissionAccess(
  Integrations,
  ModulesEnum?.integration,
  AccessLevelEnum?.read
);
