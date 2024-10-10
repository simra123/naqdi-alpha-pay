"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { createDepoistAddressApi } from "@/services/wallet";
import Image from "next/image";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import {
  blockchains,
  production_networks,
  testnet_networks,
  networks_available,
} from "@/constants/blockchains";
import IconSelectBox from "../../common/IconSelectBox";
import LoaderButton from "../../common/LoaderButton";
import Details from "@/components/common/Details";

interface Network {
  label: string;
  value: string;
  standard?: string;
}

const DepositModal = ({ isOpen, setIsOpen }) => {
  const [isDepoistLoading, isDepositError, callDeposistApi, setDepoistError] =
    useApi();
  const [networks, setNeworks] = useState<Record<string, Network[]>>({});

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
    };
    const TokenData = {
      blockchain: seletedOption?.blockchain,
      standard: seletedOption?.standard,
    };
    await callApiHook({
      apiCall: callDeposistApi(
        createDepoistAddressApi(seletedOption?.standard ? TokenData : CoinData)
      ),
      successCallBack: (response: any) => {

        setDepositAddress(response);
      },
    });
  };

  useEffect(() => {
    setNeworks(
      process.env.NEXT_PUBLIC_ENVIRONMENT == "dev"
        ? testnet_networks
        : production_networks
    );
  }, []);

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

    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  return (
    <Modal isOpen={isOpen}>

      <h2 className="text-xl font-bold mb-6">Create Depoist Address</h2>

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
          placeholder="Select a Standard"
          label="Select a Standard"
          onChange={handleChange}
        />
      )}

      <ErrorApiText error={isDepositError} />

      <LoadingApi loading={isDepoistLoading}>
        {depositAddress && (
          <>
            <div className="flex flex-col items-center overflow-hidden">
              <Image
                src={depositAddress?.qrCode}
                height={250}
                width={250}
                alt="Depoist"
              />

              <Details copyable value={depositAddress?.wallet_Address} />
            </div>

            <p className="text-custom-caption-gray text-button mt-6">
              This Address is generated for Depositing{" "}
              {depositAddress?.blockchain} on the {depositAddress?.network}{" "}
              network.
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

    </Modal>
  );
};

export default DepositModal;
