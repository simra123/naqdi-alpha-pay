"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";

import { Close } from "@mui/icons-material";
import SelectBox from "../SelectBox";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { createDepoistAddressApi } from "@/services/wallet";
import Image from "next/image";
import LoadingApi from "../LoadindApi";
import ErrorApiText from "../ErrorApiText";

const blockchains = [
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
];
const networks = {
  bitcoin: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Testnet", value: "testnet" },
  ],
  ethereum: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Sepolia", value: "sepolia" },
  ],
};

const DepositModal = ({ isOpen, setIsOpen }) => {
  const [isDepoistLoading, isDepositError, callDeposistApi, setDepoistError] =
    useApi();
  const [filteredNets, setFilteredNets] = useState([]);
  const [depositAddress, setDepositAddress] = useState(null);
  const [seletedOption, setSelectedOption] = useState({
    network: "",
    blockchain: "",
  });

  const createDepoistAddress = async () => {
    await callApiHook({
      apiCall: callDeposistApi(
        createDepoistAddressApi({
          blockchain: seletedOption?.blockchain,
          network: seletedOption?.network,
        })
      ),
      successCallBack: (response: any) => {
        console.log("deposit address created ", response);
        setDepositAddress(response);
      },
    });
  };

  useEffect(() => {
    if (seletedOption?.blockchain && seletedOption?.network) {
      createDepoistAddress();
    }
  }, [seletedOption]);
  useEffect(() => {
    if (isDepositError) {
      setDepositAddress(null);
    }
  }, [isDepositError]);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOption({
      blockchain: "",
      network: "",
    });
    setDepositAddress(null);
    setDepoistError(null);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name == "blockchain") {
      setFilteredNets(networks[value]);
      setSelectedOption((pre) => ({ ...pre, network: "" }));
      setDepositAddress(null);
    }
    setSelectedOption((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="min-h-full p-8 flex place-items-center place-content-center">
        <div className="flex gap-3">
          <div className="request_box shadow-md-border px-8 py-6 bg-white gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Create Depoist Address</h3>
              <div className="flex gap-2">
                <SelectBox
                  className="transparent !border-0 min-w-44 !p-0"
                  options={blockchains}
                  name="blockchain"
                  value={seletedOption.blockchain}
                  placeholder="Select a Blockchain"
                  onChange={handleChange}
                  sx={{
                    ".MuiSelect-outlined": {
                      padding: "8px 12px !important",
                    },

                    borderRadius: "0 !important",
                  }}
                />
                <SelectBox
                  className="transparent !border-0 min-w-44 !p-0"
                  options={filteredNets}
                  name="network"
                  disabled={!seletedOption?.blockchain}
                  value={seletedOption.network}
                  placeholder="Select a Network"
                  onChange={handleChange}
                  sx={{
                    ".MuiSelect-outlined": {
                      padding: "8px 12px !important",
                    },

                    borderRadius: "0 !important",
                  }}
                />
              </div>
              <ErrorApiText error={isDepositError} />
              <LoadingApi loading={isDepoistLoading}>
                {depositAddress && (
                  <>
                    <div className="flex flex-col items-center">
                      <Image
                        src={depositAddress?.qrCode}
                        height={250}
                        width={250}
                        alt="Depoist"
                      />
                      <p>{depositAddress?.wallet_Address}</p>
                    </div>

                    <p className="note">
                      <span className="font-bold">Note :</span> This Address is
                      generated for Depositing {depositAddress?.blockchain} on
                      the {depositAddress?.network} network.
                    </p>
                  </>
                )}
              </LoadingApi>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="outline-none p-1 rounded-sm border-none text-white bg-red-500"
              onClick={closeModal}
            >
              <Close />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DepositModal;
