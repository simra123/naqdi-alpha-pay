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

enum STANDARD {
  BITCOIN = "Omni-layer",
  ETHEREUM = "ERC-20",
  TRON = "TRC-20",
}

const blockchains = [
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Tron", value: "tron" },
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
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
  tron: [
    { label: "Mainnet", value: "mainnet" },
    { label: "Nile", value: "nile" },
  ],
  USDT: [
    {
      label: "Bitcoin(Omni Layer)",
      value: "mainnet(btc)",
      standard: STANDARD.BITCOIN,
    },
    {
      label: "Testnet(BTC)(Omni Layer)",
      value: "testnet",
      standard: STANDARD.BITCOIN,
    },
    {
      label: "Ethereum(ERC-20)",
      value: "mainnet(eth)",
      standard: STANDARD.ETHEREUM,
    },
    {
      label: "Sepolia(ETH)(ERC-20)",
      value: "sepolia",
      standard: STANDARD.ETHEREUM,
    },
    { label: "Tron(TRC-20)", value: `mainnet(tron)`, standard: STANDARD.TRON },
    {
      label: "Nile(Tron)(TRC-20)",
      value: `nile(tron)`,
      standard: STANDARD.TRON,
    },
  ],
  USDC: [
    { label: "Ethereum", value: "mainnet(eth)", standard: STANDARD.ETHEREUM },
    { label: "Sepolia(ETH)", value: "sepolia", standard: STANDARD.ETHEREUM },
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
    standard: "",
  });

  const createDepoistAddress = async () => {
    const CoinData = {
      blockchain: seletedOption?.blockchain,
      network: getValidValue(seletedOption?.network),
    };
    const TokenData = {
      blockchain: seletedOption?.blockchain,
      network: getValidValue(seletedOption?.network),
      standard: seletedOption?.standard,
    };
    await callApiHook({
      apiCall: callDeposistApi(
        createDepoistAddressApi(seletedOption?.standard ? TokenData : CoinData)
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
      standard: "",
    });
    setDepositAddress(null);
    setDepoistError(null);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      setFilteredNets(networks[value]);
      setSelectedOption((prev) => ({
        blockchain: value,
        network: "",
        standard: "", // Reset standard when blockchain changes
      }));
      setDepositAddress(null);
    } else if (name === "network") {
      const standard = filteredNetworks(seletedOption.blockchain, value);
      console.log("SSTADNADRD", standard);
      setSelectedOption((prev) => ({
        ...prev,
        [name]: value,
        standard: standard || "", // Set standard if available, otherwise reset
      }));
    }
  };

  const getValidValue = (str) => {
    let index = str.indexOf("(");
    let result = index !== -1 ? str.substring(0, index) : str;
    return result;
  };

  const filteredNetworks = (blockchain, network) => {
    console.log({ network, blockchain });

    return networks[blockchain].find((item) => item.value == network)?.standard;
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
