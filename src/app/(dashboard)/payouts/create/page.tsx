"use client";

import React, { useEffect, useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import {
  blockchain_standards,
  networks,
  networks_available,
} from "@/constants/blockchains";
import { useApi } from "@/hooks/useApi";
import { getAllWalletBalancesApi } from "@/services/wallet";
import { callApiHook } from "@/utils/apifuncs";
import { formatBalanceForUser } from "@/utils/dataFormatters";
import { getCrpyoToFiatApi, getFeesApi } from "@/services/common";
import { clamp, roundToPrecision } from "@/utils/math";
import { fiatOptions } from "@/constants/fiat";
import { createPayoutRequestApi } from "@/services/payout";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import TransactionDataModal from "@/components/common/TransactionDataModal";
import LoaderButton from "@/components/common/LoaderButton";

const PayoutDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [balance, setBalance] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [otp, setOtp] = useState();
  const [isCreateOpen, setisCreateOpen] = useState(false);
  const [destinationAmount, setDestinationAmount] = useState("0");
  const [trnasctionFee, settrnasctionFee] = useState(0);
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi(true);
  const [isFeeLoading, isFeeError, callFeeApi] = useApi(true);
  const [isConversionLoading, isConversionError, callConversionApi] = useApi();
  const [isCreatePayoutLoading, isCreatePayoutError, callCreatePayoutApi] =
    useApi();

  const [sourceOptions, setSourceOptions] = useState({
    filteredNets: [],
    blockchain: "",
    network: "",
    standard: "",
  });

  const [data, setData] = useState({
    requested_currency: "",
    bank_account: "",
    account_title: "",
    amount: "",
  });

  const handleSourceChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      console.log(networks, value);

      setSourceOptions((prev) => ({
        ...prev,
        filteredNets: networks[value],
        blockchain: value,
        network: "",
        standard: blockchain_standards[value], // Reset standard when blockchain changes
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

  const handleInputChange = (event, name) => {
    const { value } = event.target;

    if (name == "amount") {
      const maxVal = clamp(
        value,
        getCurrentAssetAmount(sourceOptions.blockchain)
      );
      return setData((pre) => ({ ...pre, [name]: maxVal }));
    }

    setData((pre) => ({ ...pre, [name]: value }));
  };

  const handleCreatePayout = async () => {
    await callApiHook({
      apiCall: callCreatePayoutApi(
        createPayoutRequestApi({
          account_title: data.account_title,
          amount: data.amount,
          bank_account: data.bank_account,
          requested_currency: data.requested_currency,
          unit: sourceOptions.blockchain,
          standard: networks_available[sourceOptions.blockchain]
            ? filteredNetworks(sourceOptions.network, sourceOptions.blockchain)
            : "",
            token: otp
        })
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Payout Request Created Successfully",
            status: "success",
          })
        );
        router.push("/payouts");
      },
    });
  };

  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        const tableData = formatBalanceForUser(response?.result);
        const withdraw_currency_options = tableData.map((item) => {
          return {
            label: item?.currency,
            value: item.currency,
            amount: item?.totalAmount,
          };
        });
        setBalance(withdraw_currency_options);
      },
    });
  };

  const getAlphasPayFee = async () => {
    await callApiHook({
      apiCall: callFeeApi(getFeesApi(data?.amount)),
      successCallBack: (response: any) => {
        settrnasctionFee(response?.alphaspayFees);
        setDestinationAmount(response?.netAmount);
      },
    });
  };

  const getConvertedAmount = async () => {
    await callApiHook({
      apiCall: callConversionApi(
        getCrpyoToFiatApi({
          cryptoAmount: destinationAmount,
          currency: data.requested_currency,
          unit: sourceOptions?.blockchain,
        })
      ),
      successCallBack: (response: any) => {
        setConvertedAmount(response?.convertedAmount);
        !isCreateOpen && toggleCreateModal();
      },
    });
  };

  useEffect(() => {
    _getUserBalance();
  }, []);

  useEffect(() => {
    getAlphasPayFee();
  }, [data.amount]);

  const filteredNetworks = (network, blockchain) => {
    console.log({ network, blockchain });

    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  const getCurrentAssetAmount = (value) => {
    return balance.find((item) => item.value == value)?.amount;
  };

  const toggleCreateModal = () => {
    setisCreateOpen(!isCreateOpen);
  };

  return (
    <DashboardPageWrapper>
      <TransactionDataModal
        otp={otp}
        setOtp={setOtp}
        type="payout"
        isOpen={isCreateOpen}
        handleClose={toggleCreateModal}
        buttonLoading={isCreatePayoutLoading}
        handleTransaction={handleCreatePayout}
        transactionError={isCreatePayoutError}
        data={{
          amount: data?.amount,
          fee: trnasctionFee,
          netAmount: +destinationAmount,
          network: sourceOptions.standard,
          recipientAddress: data.bank_account,
          blockchain: sourceOptions.blockchain,
          from_currency: sourceOptions.blockchain,
          converted_amount: convertedAmount,
          to_currency: data.requested_currency,
        }}
      />

      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Payout</h2>
        </div>

        <LoadingApi loading={isCreatePayoutLoading}>
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper
                title={"Source Currency & Network"}
                className="items-baseline"
              >
                <div className="flex flex-col gap-1">
                  <SelectBox
                    className="transparent !border-0 min-w-44 !p-0"
                    options={balance}
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
                  {sourceOptions.blockchain && (
                    <p className="note">
                      <span className="font-bold">Available Balance : </span>
                      {getCurrentAssetAmount(sourceOptions.blockchain)}
                    </p>
                  )}
                </div>
                {networks_available[sourceOptions.blockchain] && (
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
                )}
              </DetailsWrapper>
              <DetailsWrapper
                title={"Source Amount & Destination Amount"}
                align
              >
                <TransparentInput
                  value={data?.amount}
                  label="Amount"
                  disabled={false}
                  onChange={(e) => handleInputChange(e, "amount")}
                />
                <TransparentInput
                  value={destinationAmount}
                  label="Destination Amount"
                />
              </DetailsWrapper>

              <DetailsWrapper title={"Requested Currency"}>
                <SelectBox
                  className="transparent !border-0 min-w-44 !p-0"
                  options={fiatOptions}
                  name="fiat"
                  value={data.requested_currency}
                  placeholder="Select a Currency"
                  onChange={(e) => handleInputChange(e, "requested_currency")}
                  sx={{
                    ".MuiSelect-outlined": {
                      padding: "8px 12px !important",
                    },

                    borderRadius: "0 !important",
                  }}
                />
              </DetailsWrapper>

              <DetailsWrapper title={"To Bank Account (IBAN)"}>
                <TransparentInput
                  value={data.bank_account}
                  disabled={false}
                  onChange={(e) => handleInputChange(e, "bank_account")}
                />
              </DetailsWrapper>

              <DetailsWrapper title={"Account Title"}>
                <TransparentInput
                  value={data.account_title}
                  disabled={false}
                  onChange={(e) => handleInputChange(e, "account_title")}
                />
              </DetailsWrapper>

              <ErrorApiText error={isCreatePayoutError} />

              <div className="flex gap-2 justify-center max-w-[75%] mt-6">
                <LoaderButton
                  loading={isConversionLoading}
                  variant="outlined"
                  content={"Create"}
                  disabled={
                    !sourceOptions.blockchain ||
                    !data.amount ||
                    !data?.account_title ||
                    !data?.bank_account ||
                    !data?.requested_currency
                  }
                  onClick={getConvertedAmount}
                />
              </div>
            </div>
          </div>
        </LoadingApi>
      </div>
    </DashboardPageWrapper>
  );
};

export default PayoutDetails;
