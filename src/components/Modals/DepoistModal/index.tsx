"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { callApiHook, sendPaymentInvoiceWhatsapp } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";

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
import { getLocalStorageValue } from "@/utils/cookies";
import IconField from "@/components/common/IconField";
import { roundToPrecision } from "@/utils/math";
import Checkbox from "@/components/common/CheckBox";
import useFormValidation from "@/hooks/useFormValidation";
import { DepoistSchema } from "@/models/deposit";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

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
  onSuccessCallback?: () => void;
  type?: "payment" | "deposit";
}

const initalFormValues = {
  network: "",
  blockchain: "",
  standard: "",
  amount: "",
  client_name: "",
  client_email: "",
  client_phone_number: "",
  send_email: false,
};

const DepositModal = ({
  isOpen,
  setIsOpen,
  blockchain,
  standard,
  onSuccessCallback,
  type,
}: DepositProps) => {
  const user = getLocalStorageValue("user");
  const [isDepoistLoading, isDepositError, callDeposistApi, setDepoistError] =
    useApi();
  const [networks, setNeworks] = useState<Record<string, Network[]>>({});

  const [filteredNets, setFilteredNets] = useState([]);
  const [depositAddress, setDepositAddress] = useState(null);

  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
    setErrors,
  } = useFormValidation(initalFormValues, DepoistSchema);

  const createDepoistAddress = async () => {
    await callApiHook({
      apiCall: callDeposistApi(
        createPaymentDepositApi({
          unit: blockchain_units[
            values?.blockchain?.toLowerCase()
          ]?.toUpperCase(),
          standard: values?.standard,
          amount: +values.amount,
          customer_email: values?.client_email,
          customer_name: values?.client_name,
          customer_phone_number: values?.client_phone_number,
          send_email: values?.send_email,
        })
      ),
      statusCode: 201,
      successCallBack: (response: any) => {
        setDepositAddress(response);
        if (values?.whatsapp_notification && values?.client_phone_number) {
          sendPaymentInvoiceWhatsapp({
            address: response?.address,
            client_name: values?.client_name,
            currency: response?.payment_currency,
            network:
              values?.network ||
              blockchain_standards[response?.payment_currency],
            phone_number: values?.client_phone_number,
            amount: response?.payment_amount,
          });
        }

        if (onSuccessCallback) {
          onSuccessCallback();
        }
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

  useEffect(() => {
    if (isOpen && blockchain) {
      setValues((pre) => ({
        ...pre,
        blockchain: blockchain,
      }));
      if (standard) {
        setFilteredNets(networks[blockchain?.toLowerCase()]);
        const blockchainName = standardBlockchain[standard];

        setValues((pre) => ({
          ...pre,
          network: blockchainName,
          standard: standard,
        }));
      }
    } else {
      cleanupModal();
    }
  }, [blockchain, standard, isOpen]);

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
    setValues(initalFormValues);
    setDepositAddress(null);
    setDepoistError(null);
  };

  const handleChangeBlockchains = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      setFilteredNets(networks[value?.toLowerCase()]);
      setValues((prev) => ({
        ...prev,
        blockchain: value,
        network: "",
        standard: "", // Reset standard when blockchain changes
      }));
      setDepositAddress(null);
    } else if (name === "network") {
      const standard = filteredNetworks(
        values.blockchain?.toLowerCase(),
        value
      );

      setValues((prev) => ({
        ...prev,
        [name]: value,
        standard: standard || "", // Set standard if available, otherwise reset
      }));
    } else {
      handleChange(event);
    }
  };

  const filteredNetworks = (blockchain, network) => {
    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h2 className="mb-6 font-bold text-xl">Add Deposit</h2>
      {!depositAddress && (
        <form onSubmit={(event) => handleSubmit(event, createDepoistAddress)}>
          <IconSelectBox
            label="Select a Blockchain"
            options={blockchains}
            name="blockchain"
            error={errors?.blockchain}
            value={values.blockchain}
            placeholder="Select a Blockchain"
            onChange={handleChangeBlockchains}
          />

          {networks_available[values.blockchain] && (
            <IconSelectBox
              options={filteredNets}
              name="network"
              error={errors?.network}
              value={values.network}
              placeholder="Select a Standard"
              label="Select a Standard"
              onChange={handleChangeBlockchains}
            />
          )}

          <IconField
            label="Amount (USD)"
            name="amount"
            type="number"
            error={errors?.amount}
            value={values.amount}
            placeholder="Enter amount in USD to deposit"
            onChange={handleChange}
            onBlur={validateField}
          />
          <IconField
            label="Client Name"
            name="client_name"
            error={errors?.client_name}
            value={values.client_name}
            placeholder="Enter client name"
            onChange={handleChange}
            onBlur={validateField}
          />
          <IconField
            label="Client Email"
            name="client_email"
            error={errors?.client_email}
            value={values.client_email}
            placeholder="Enter client email"
            onChange={handleChange}
            onBlur={validateField}
          />
          {/* <IconField
            label="Client Phone Number"
            name="client_phone_number"
            error={errors?.client_phone_number}
            value={values.client_phone_number}
            placeholder="Enter client phone number"
            onChange={handleChange}
          /> */}

          <Checkbox
            label="Send Invoice Email"
            name="send_email"
            checked={values?.send_email}
            onChange={handleChange}
          />
          <div className="mt-4">
            <Checkbox
              label="Send Invoice Whatsapp"
              name="whatsapp_notification"
              checked={values?.whatsapp_notification}
              onChange={handleChange}
            />
          </div>
          {values?.whatsapp_notification && (
            <div className="mt-4 w-full">
              <label className="block mb-2 font-medium">
                Client Phone Number
              </label>
              <PhoneInput
                inputClass="!rounded-large !py-3 w-[360px] !w-full outline-none px-4 border focus:!border-1 focus:!border-light-gray hover:!border-light-gray !border-light-gray focus:!shadow-none hover:border-"
                onChange={(value) =>
                  handleChange({
                    target: { name: "client_phone_number", value },
                  })
                }
                enableSearch
                specialLabel={null}
                value={values.client_phone_number}
              />
            </div>
          )}

          <ErrorApiText error={isDepositError} />

          {!depositAddress && (
            <div className="flex flex-col justify-end mt-2">
              <LoaderButton
                type="submit"
                loading={isDepoistLoading}
                className="mt-6"
                content={"Create"}
                variant="contained"
              />
            </div>
          )}
        </form>
      )}

      {depositAddress && (
        <>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <p className="font-bold text-caption text-custom-title-gray">
                Currency
              </p>
              <p className="font-medium text-black-100">
                {depositAddress?.unit}
              </p>
            </div>
            <div>
              <p className="font-bold text-caption text-custom-title-gray">
                Requested Amount ({depositAddress?.fiat_currency})
              </p>
              <p className="font-medium text-black-100">
                {depositAddress?.fiat_initial_amount}
              </p>
            </div>
            <div>
              <p className="font-bold text-caption text-custom-title-gray">
                Alphaspay Fee ({depositAddress?.unit})
              </p>
              <p className="font-medium text-black-100">
                {roundToPrecision(+depositAddress?.initial_fee, 10)}
              </p>
            </div>
            <div>
              <p className="font-bold text-caption text-custom-title-gray">
                Alphaspay Fee ({depositAddress?.fiat_currency})
              </p>
              <p className="font-medium text-black-100">
                {roundToPrecision(+depositAddress?.fiat_initial_fee, 10)}
              </p>
            </div>

            <div>
              <p className="font-bold text-caption text-custom-title-gray">
                Deposit Amount ({depositAddress?.unit})
              </p>
              <p className="font-medium text-black-100">
                {roundToPrecision(+depositAddress?.initial_amount, 10)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center overflow-hidden">
            <Image
              src={depositAddress?.wallet?.qr_code}
              height={250}
              width={250}
              alt="Depoist"
            />

            <Details copyable value={depositAddress?.wallet?.address} />
          </div>

          <p className="mt-6 text-button text-custom-caption-gray">
            This Address is generated for depositing {depositAddress?.unit} on
            the{" "}
            <span className="capitalize">
              {depositAddress?.wallet?.blockchain}
            </span>{" "}
            network.
          </p>
        </>
      )}

      {depositAddress && (
        <div className="flex flex-col justify-end mt-2">
          <LoaderButton
            type="submit"
            className="mt-6"
            content={"Back"}
            variant="contained"
            onClick={() => setDepositAddress(null)}
          />
        </div>
      )}
    </Modal>
  );
};

export default DepositModal;
