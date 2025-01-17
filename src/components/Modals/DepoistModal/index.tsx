"use client";

import React, { use, useEffect, useState } from "react";
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
  blockchain_units,
  unitName,
  blockchain_standards,
  standardBlockchain,
} from "@/constants/blockchains";
import IconSelectBox from "../../common/IconSelectBox";
import LoaderButton from "../../common/LoaderButton";
import Details from "@/components/common/Details";
import { createPaymentDepositApi } from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import IconField from "@/components/common/IconField";
import { roundToPrecision } from "@/utils/math";

interface Network {
  label: string;
  value: string;
  standard?: string;
}
interface DepositProps {
  isOpen: boolean;
  setIsOpen: any;
  blockchain?: string;
  standard?: string;
}

const DepositModal = ({
  isOpen,
  setIsOpen,
  blockchain,
  standard,
}: DepositProps) => {
  const user = useLocalStorage("user");
  const [isDepoistLoading, isDepositError, callDeposistApi, setDepoistError] =
    useApi();
  const [networks, setNeworks] = useState<Record<string, Network[]>>({});

  const [filteredNets, setFilteredNets] = useState([]);
  const [depositAddress, setDepositAddress] = useState(null);
  const [seletedOption, setSelectedOption] = useState({
    network: "",
    blockchain: "",
    standard: "",
    amount: "",
  });

  console.log({ blockchain, state: seletedOption.blockchain });

  const createDepoistAddress = async () => {
    await callApiHook({
      apiCall: callDeposistApi(
        createPaymentDepositApi({
          passthrough: JSON.stringify({
            userid: user?.id,
            username: user.username,
            paymentType: "Self",
          }),
          requested_currency: "USD",
          payment_currency:
            blockchain_units[
              seletedOption?.blockchain?.toLowerCase()
            ]?.toUpperCase(),
          payment_currency_standard: seletedOption?.standard,
          requested_amount: seletedOption.amount,
          notes: "Merchant Created This Payment Deposit",
        })
      ),
      statusCode: 201,
      successCallBack: (response: any) => {
        setDepositAddress(response);
      },
    });
  };

  useEffect(() => {
    setNeworks(
      process.env.NEXT_PUBLIC_ENVIRONMENT == "development"
        ? testnet_networks
        : production_networks
    );
  }, []);

  console.log({ blockchain, standard });

  useEffect(() => {
    if (isOpen && blockchain) {
      setSelectedOption((pre) => ({
        ...pre,
        blockchain: blockchain,
      }));
      if (standard) {
        setFilteredNets(networks[blockchain?.toLowerCase()]);
        const blockchainName = standardBlockchain[standard];
        console.log({ blockchainName, standardBlockchain, standard });
        setSelectedOption((pre) => ({
          ...pre,
          network: blockchainName,
          standard: standard,
        }));
      }
    } else {
      cleanupModal();
    }
  }, [blockchain, standard, isOpen]);

  console.log(seletedOption);

  useEffect(() => {
    if (isDepositError) {
      setDepositAddress(null);
    }
  }, [isDepositError]);

  const closeModal = () => {
    setIsOpen();
    cleanupModal();
  };

  const cleanupModal = () => {
    setSelectedOption({
      blockchain: "",
      network: "",
      standard: "",
      amount: "",
    });
    setDepositAddress(null);
    setDepoistError(null);
  };

  console.log({ filteredNets, seletedOption });

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      console.log(value);
      setFilteredNets(networks[value?.toLowerCase()]);
      setSelectedOption((prev) => ({
        ...prev,
        blockchain: value,
        network: "",
        standard: "", // Reset standard when blockchain changes
      }));
      setDepositAddress(null);
    } else if (name === "network") {
      const standard = filteredNetworks(
        seletedOption.blockchain?.toLowerCase(),
        value
      );

      setSelectedOption((prev) => ({
        ...prev,
        [name]: value,
        standard: standard || "", // Set standard if available, otherwise reset
      }));
    } else {
      setSelectedOption((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const filteredNetworks = (blockchain, network) => {
    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-6">
        {!depositAddress ? "Create Depoist Address" : "Deposit Details"}
      </h2>
      {!depositAddress && (
        <>
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

          <IconField
            label="Amount (USD)"
            name="amount"
            value={seletedOption.amount}
            placeholder="Enter amount in USD to deposit"
            onChange={handleChange}
          />

          <ErrorApiText error={isDepositError} />
        </>
      )}

      <LoadingApi loading={isDepoistLoading}>
        {depositAddress && (
          <>
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Currency
                </p>
                <p className="text-black-100 font-medium">
                  {unitName[depositAddress?.payment_currency?.toLowerCase()]}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Requested Amount (USD)
                </p>
                <p className="text-black-100 font-medium">
                  {depositAddress?.requested_amount}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Alphaspay Fee
                </p>
                <p className="text-black-100 font-medium">
                  {roundToPrecision(+depositAddress?.alphaspay_fees, 10)}
                </p>
              </div>

              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Payment Amount ({depositAddress?.payment_currency})
                </p>
                <p className="text-black-100 font-medium">
                  {roundToPrecision(+depositAddress?.payment_amount, 10)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center overflow-hidden">
              <Image
                src={depositAddress?.qrcode}
                height={250}
                width={250}
                alt="Depoist"
              />

              <Details copyable value={depositAddress?.address} />
            </div>

            <p className="text-custom-caption-gray text-button mt-6">
              This Address is generated for depositing{" "}
              {unitName[depositAddress?.payment_currency?.toLowerCase()]} on the{" "}
              {seletedOption?.network ||
                blockchain_standards[depositAddress?.payment_currency]}{" "}
              network.
            </p>
          </>
        )}
      </LoadingApi>

      <div className="flex flex-col justify-end mt-2">
        <LoaderButton
          type="submit"
          className="mt-6"
          content={depositAddress ? "Back" : `Create Deposit Address`}
          variant="contained"
          onClick={
            depositAddress
              ? () => setDepositAddress(null)
              : createDepoistAddress
          }
        />
      </div>
    </Modal>
  );
};

export default DepositModal;
