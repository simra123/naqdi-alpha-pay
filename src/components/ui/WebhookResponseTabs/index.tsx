import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import clsx from "clsx";
import Checkbox from "@/components/common/CheckBox";
import { formatLocalDate } from "@/utils/dates";
import Chip from "@/components/common/Chip";
import LoaderButton from "@/components/common/LoaderButton";
import { Sync } from "@mui/icons-material";
import { RefreshIcon } from "@/assets/Svgs";
import { filterWebhooks, getWebhookPayloadById } from "@/utils/dataFormatters";
import humanizeString from "humanize-string";
import Link from "next/link";

const WebhookResponseTabs = ({ data }: { data?: any[] }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <h3 className="mb-6 font-semibold text-blackGrey-100 text-h3.5">
        Webhook Responses
      </h3>
      <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab}>
        <TabList className="flex px-2 border border-light-white rounded-lg">
          {["All", "Succeeded", "Failed"].map((tab, index) => (
            <Tab
              key={index}
              className={`px-4 py-5 cursor-pointer focus:outline-none min-w-20 text-center font-bold
                ${
                  selectedTab === index
                    ? "!border-purple !border-b-2  !text-purple-500"
                    : "!border-0 !text-blackGrey-70"
                }
              `}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <ResponeData responses={data} />
        </TabPanel>
        <TabPanel>
          <ResponeData
            responses={filterWebhooks({
              webhooks: data,
              filterType: "success",
            })}
          />
        </TabPanel>
        <TabPanel>
          <ResponeData
            responses={filterWebhooks({ webhooks: data, filterType: "failed" })}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default WebhookResponseTabs;

const ResponeData = ({ responses }) => {
  const [selectedWebhook, setSelectedWebhook] = useState(
    getWebhookPayloadById(responses, responses[0]?.id)
  );

  console.log({ selectedWebhook });

  return responses && responses?.length > 0 ? (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mt-4">
      <div className="space-y-2 pr-5 sm:pr-[42px] max-h-[340px] overflow-auto thinScrollbarPadded">
        {responses.map((response) => (
          <div
            key={response.id}
            className="bg-table-header flex items-start gap-[17px] hover:brightness-95 p-[18px] rounded-lg transition-all cursor-pointer"
            onClick={() =>
              setSelectedWebhook(getWebhookPayloadById(responses, response?.id))
            }
          >
            <Checkbox className="w-6 h-6" checked />

            <div>
              <p className="mb-3 font-medium text-input capitalize">
                {humanizeString(response.webhookStatus)}
              </p>
              <p className="text-gray-500 text-sm">
                {formatLocalDate(response.updatedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pr-5 sm:pr-[20px] rounded-[10px] max-h-[340px] overflow-auto thinScrollbarPadded">
        <div className="bg-blackGrey-10 px-7 py-[22px] rounded-[10px]">
          <div className="flex justify-between items-center">
            <p className="font-extrabold text-[#0B081D] text-input capitalize">
              {humanizeString(selectedWebhook?.webhookStatus)}
            </p>
            {/* <LoaderButton
              content={
                <div className="flex items-center gap-2">
                  <RefreshIcon /> Refresh
                </div>
              }
              className="flex px-4 text-purple-500"
              variant="text"
            /> */}
          </div>
          <p className="mt-5 mb-4 text-input">Request</p>
          <div
            className={`px-4 py-1 rounded max-w-max text-caption font-semibold  ${
              selectedWebhook.statusCode >= 400
                ? "text-red-chip bg-chip-red"
                : "text-green-chip bg-chip-green"
            }`}
          >
            {selectedWebhook?.statusCode}
          </div>

          <p className="mt-5 mb-2 font-semibold text-input">
            Webhook Url
          </p>
          <Link href={selectedWebhook?.userWebhookUrl} target="_blank" className="text-blue-600">
            {selectedWebhook?.userWebhookUrl || 'N/A'}
          </Link>
          <p className="mt-4 mb-2 font-semibold text-input">
            Response Text
          </p>
          <p  className="text-[#666666]">
            {selectedWebhook?.responseText || "N/A"}
          </p>
          <p className="mt-4 font-bold text-[#666666] text-input">
            HTTP Response
          </p>
         
          <div className="overflow-x-hidden">
            <pre className="mt-2 p-2 rounded overflow-x-auto font-medium text-[#666666] text-input">
              {JSON.stringify(selectedWebhook?.payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="py-10 min-h-80 text-p120 text-center">No webhooks found</p>
  );
};
