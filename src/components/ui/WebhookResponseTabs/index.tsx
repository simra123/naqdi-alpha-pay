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

const WebhookResponseTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const responses = [
    {
      id: 1,
      title: "Incoming Confirmed Token Transaction",
      date: "2025-03-16T12:27:00Z",
      status: "success",
    },
    {
      id: 2,
      title: "Incoming Confirmed Token Transaction",
      date: "2025-03-13T12:27:00Z",
      status: "success",
    },
    {
      id: 3,
      title: "Incoming Confirmed Token Transaction",
      date: "2025-03-13T12:27:00Z",
      status: "success",
    },
    {
      id: 4,
      title: "Incoming Confirmed Token Transaction",
      date: "2025-03-13T12:27:00Z",
      status: "success",
    },
  ];

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
          <ResponeData responses={responses} />
        </TabPanel>
        <TabPanel>
          <ResponeData responses={responses} />
        </TabPanel>
        <TabPanel>
          <ResponeData responses={responses} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default WebhookResponseTabs;

const ResponeData = ({ responses }) => {
  return (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mt-4">
      <div className="space-y-2 pr-5 sm:pr-[42px] max-h-[340px] overflow-auto thinScrollbarPadded">
        {responses.map((response) => (
          <div
            key={response.id}
            className="bg-table-header flex items-start gap-[17px] p-[18px] rounded-lg"
          >
            <Checkbox className="w-6 h-6" checked />

            <div>
              <p className="mb-3 font-medium text-input">{response.title}</p>
              <p className="text-gray-500 text-sm">
                {formatLocalDate(response.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pr-5 sm:pr-[20px] rounded-[10px] max-h-[340px] overflow-auto thinScrollbarPadded">
        <div className="bg-blackGrey-10 px-7 py-[22px] rounded-[10px]">
          <div className="flex justify-between items-center">
            <p className="font-extrabold text-[#0B081D] text-input">
              Incoming Confirmed Token Transaction
            </p>
            <LoaderButton
              content={<div className="flex items-center gap-2"><RefreshIcon />  Refresh</div>}
              className="flex px-4 text-purple-500"
              variant="text"
            />
          </div>
          <p className="mt-5 mb-4 text-input">Request</p>
          <Chip status="200 Ok" />

          <p className="mt-4 font-bold text-[#666666] text-input">
            HTTP Response Status Code
          </p>
          <div className="overflow-x-hidden">
            <pre className="mt-2 p-2 rounded overflow-x-auto font-medium text-[#666666] text-input">{`{
media (min-width: 0px) and (max-width: 1023px) {
    .bUEPEH {
        (min-width: 0px) and (max-width: 1023px) {
            .bUEPEH {
                }
            }
        }
    }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
