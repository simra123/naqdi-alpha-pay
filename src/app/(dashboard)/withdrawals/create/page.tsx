"use client";

import React, { useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { DataGrid } from "@mui/x-data-grid";
import SelectBox from "@/components/common/SelectBox";
import { blockchains, networks } from "@/constants/blockchains";
import LoaderButton from "@/components/common/LoaderButton";
import { Button } from "@mui/material";
import CreateWithdrawalModal from "@/components/common/CreateWithdrawalModal";
import { withAuth } from "@/middleware/RoleBaseAuth";
import { Role } from "@/constants/roles";

const CreateWithdrawal = () => {
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const [sourceOptions, setSourceOptions] = useState({
    filteredNets: [],
    blockchain: "",
    network: "",
    standard: "",
  });

  const [destinationOptions, setDestinationOptions] = useState({
    filteredNets: [],
    blockchain: "",
    network: "",
    standard: "",
  });

  const [data, setData] = useState({
    sourceAmount: "",
    walletAddress: "",
    notes: "",
  });

  const handleSourceChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      setSourceOptions((prev) => ({
        ...prev,
        filteredNets: networks[value],
        blockchain: value,
        network: "",
        standard: "", // Reset standard when blockchain changes
      }));
    } else if (name === "network") {
      const standard = filteredNetworks(value, sourceOptions.blockchain);

      setSourceOptions((prev) => ({
        ...prev,
        [name]: value,
        standard: standard || "", // Set standard if available, otherwise reset
      }));
    }
  };

  const handleDestinationChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      setDestinationOptions((prev) => ({
        ...prev,
        filteredNets: networks[value],
        blockchain: value,
        network: "",
        standard: "", // Reset standard when blockchain changes
      }));
    } else if (name === "network") {
      const standard = filteredNetworks(value, destinationOptions.blockchain);

      setDestinationOptions((prev) => ({
        ...prev,
        [name]: value,
        standard: standard || "", // Set standard if available, otherwise reset
      }));
    }
  };

  const handleInputChange = (event, name) => {
    const { value } = event.target;

    setData((pre) => ({ ...pre, [name]: value }));
  };

  const getValidValue = (str) => {
    let index = str.indexOf("(");
    let result = index !== -1 ? str.substring(0, index) : str;
    return result;
  };

  const filteredNetworks = (network, blockchain) => {
    console.log({ network, blockchain });

    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  const toggleWithdrawModal = () => {
    setWithdrawOpen(!withdrawOpen);
  };

  return (
    <DashboardPageWrapper>
      <CreateWithdrawalModal
        isOpen={withdrawOpen}
        handleClose={toggleWithdrawModal}
      />

      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Withdrawal</h2>
        </div>

        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Source Currency & Network"}>
              <SelectBox
                className="transparent !border-0 min-w-44 !p-0"
                options={blockchains}
                name="blockchain"
                value={sourceOptions.blockchain}
                placeholder="Select a Blockchain"
                onChange={handleSourceChange}
                sx={{
                  ".MuiSelect-outlined": {
                    padding: "8px 12px !important",
                  },

                  borderRadius: "0 !important",
                }}
              />
              <SelectBox
                className="transparent !border-0 min-w-44 !p-0"
                options={sourceOptions.filteredNets}
                name="network"
                disabled={!sourceOptions.blockchain}
                value={sourceOptions.network}
                placeholder="Select a Network"
                onChange={handleSourceChange}
                sx={{
                  ".MuiSelect-outlined": {
                    padding: "8px 12px !important",
                  },

                  borderRadius: "0 !important",
                }}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Destination Currency & Network"}>
              <SelectBox
                className="transparent !border-0 min-w-44 !p-0"
                options={blockchains}
                name="blockchain"
                value={destinationOptions.blockchain}
                placeholder="Select a Blockchain"
                onChange={handleDestinationChange}
                sx={{
                  ".MuiSelect-outlined": {
                    padding: "8px 12px !important",
                  },

                  borderRadius: "0 !important",
                }}
              />
              <SelectBox
                className="transparent !border-0 min-w-44 !p-0"
                options={destinationOptions.filteredNets}
                name="network"
                disabled={!destinationOptions.blockchain}
                value={destinationOptions.network}
                placeholder="Select a Network"
                onChange={handleDestinationChange}
                sx={{
                  ".MuiSelect-outlined": {
                    padding: "8px 12px !important",
                  },

                  borderRadius: "0 !important",
                }}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Source Amount & Destination Amount"} align>
              <TransparentInput
                value={data?.sourceAmount}
                label="Source Amount"
                disabled={false}
                onChange={(e) => handleInputChange(e, "sourceAmount")}
              />
              <TransparentInput
                value={data?.sourceAmount}
                label="Destination Amount"
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Recipient Wallet Address"} col>
              <TransparentInput
                value={data?.walletAddress}
                label="Wallet Address"
                disabled={false}
                onChange={(e) => handleInputChange(e, "walletAddress")}
              />
            </DetailsWrapper>

            <DetailsWrapper title={"Notes"}>
              <TransparentInput
                disabled={false}
                value={data?.notes}
                onChange={(e) => handleInputChange(e, "notes")}
              />
            </DetailsWrapper>
          </div>

          <div className="flex gap-2 justify-center max-w-[75%] mt-6">
            <Button variant="text" className="py-2 px-8" disabled>
              Cancel
            </Button>
            <LoaderButton
              content={"Create"}
              loading={false}
              onClick={toggleWithdrawModal}
            />
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default withAuth(CreateWithdrawal, [Role.USER]);
