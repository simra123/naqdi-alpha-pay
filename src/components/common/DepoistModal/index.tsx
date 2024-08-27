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
import {
  blockchains,
  networks,
  networks_available,
} from "@/constants/blockchains";
import IconSelectBox from "../IconSelectBox";
import LoaderButton from "../LoaderButton";

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
      <div className="modal_content_wrapper bg-white p-8 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Desposit</h2>

        <IconSelectBox
          label="Select a Blockchain"
          options={blockchains}
          name="blockchain"
          value={seletedOption.blockchain}
          placeholder="Select a Blockchain"
          onChange={handleChange}
        />

        {networks_available[seletedOption.blockchain] && (
          <IconSelectBox
            options={filteredNets}
            name="network"
            value={seletedOption.network}
            placeholder="Select a Network"
            label="Select a Network"
            onChange={handleChange}
          />
        )}

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
                <p className="font-semibold text-black-100 text-p120">{depositAddress?.wallet_Address}</p>
              </div>

              <p className="text-custom-caption-gray text-button mt-6">
                 This Address is
                generated for Depositing {depositAddress?.blockchain} on the{" "}
                {depositAddress?.network} network.
              </p>
            </>
          )}
        </LoadingApi>

        <div className="flex flex-col justify-end mt-2">
          <LoaderButton
            type="submit"
            className="mt-6"
            content={`Create Deposit Address`}
            variant="contained"
            onClick={createDepoistAddress}
          />

          <button
            type="button"
            className="text-black-100 px-4 py-2 mt-2"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DepositModal;
