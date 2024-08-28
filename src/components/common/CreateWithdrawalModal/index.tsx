import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary
import IconSelectBox from "../IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import {
  blockchain_standards,
  networks,
  networks_available,
} from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import { formatBalanceForUser } from "@/utils/dataFormatters";
import { getFeesApi } from "@/services/common";
import { createWithdrawalApi } from "@/services/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import { clamp } from "@/utils/math";
import IconField from "../IconField";
import LoaderButton from "../LoaderButton";
import LoadingApi from "../LoadindApi";
import ErrorApiText from "../ErrorApiText";
import OtpInput from "react-otp-input";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
}

const CreateWithdrawalModal = ({
  isOpen,
  toggleHandler,
  refreshHandler,
}: Props) => {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState([]);
  const [destinationAmount, setDestinationAmount] = useState("0");
  const [otp, setOtp] = useState("");
  const [withdrawalFee, setWithdrawalFee] = useState(0);
  const [isWithdrawalLoading, isWithdrawalError, callWithdrawalApi] = useApi();
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi(true);
  const [isFeeLoading, isFeeError, callFeeApi] = useApi();

  const [sourceOptions, setSourceOptions] = useState({
    filteredNets: [],
    blockchain: "",
    network: "",
    standard: "",
    token: "",
  });

  // const [destinationOptions, setDestinationOptions] = useState({
  //   filteredNets: [],
  //   blockchain: "",
  //   network: "",
  //   standard: "",
  // });

  const [data, setData] = useState({
    sourceAmount: "",
    walletAddress: "",
    notes: "",
  });

  const handleSourceChange = (event) => {
    const { value, name } = event.target;

    if (name === "blockchain") {
      console.log(blockchain_standards, blockchain_standards[value], value);

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
      apiCall: callFeeApi(getFeesApi(data?.sourceAmount)),
      successCallBack: (response: any) => {
        setWithdrawalFee(response?.alphaspayFees);
        setDestinationAmount(response?.netAmount);
      },
    });
  };

  const handleWithdrawal = async () => {
    await callApiHook({
      apiCall: callWithdrawalApi(
        createWithdrawalApi({
          amount: data?.sourceAmount,
          recipient_address: data.walletAddress,
          blockchain: sourceOptions.blockchain,
          notes: data.notes,
          standard: networks_available[sourceOptions.blockchain]
            ? sourceOptions.standard
            : "",
          token: otp,
        })
      ),
      successCallBack: () => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Created Successfully",
            status: "success",
          })
        );
        toggleHandler();
        refreshHandler();
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      _getUserBalance();
      setData({
        notes: "",
        sourceAmount: "",
        walletAddress: "",
      });
      setSourceOptions({
        blockchain: "",
        filteredNets: [],
        network: "",
        standard: "",
        token: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (data?.sourceAmount && isOpen) {
      getAlphasPayFee();
    }
  }, [data.sourceAmount, isOpen]);

  const handleInputChange = (event, name) => {
    const { value } = event.target;

    if (name == "sourceAmount") {
      const maxVal = clamp(
        value,
        getCurrentAssetAmount(sourceOptions.blockchain)
      );
      return setData((pre) => ({ ...pre, [name]: maxVal }));
    }

    setData((pre) => ({ ...pre, [name]: value }));
  };

  const filteredNetworks = (network, blockchain) => {
    console.log({ network, blockchain });

    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  const getCurrentAssetAmount = (value) => {
    return balance.find((item) => item.value == value)?.amount;
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-10 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-h3.5 font-semibold mb-4">Add Withdrawal</h2>

        <LoadingApi loading={isBalanceLoading}>
          <form className="mt-8 flex flex-col gap-2">
            <IconSelectBox
              wrapperClassName="!mb-2"
              label="Source Currency & Network"
              options={balance}
              name="blockchain"
              value={sourceOptions.blockchain}
              placeholder="Select a Blockchain"
              onChange={handleSourceChange}
            />

            {sourceOptions.blockchain && (
              <div className="mb-1">
                <p className="text-black-100 font-medium">
                  {getCurrentAssetAmount(sourceOptions.blockchain)}
                </p>
                <p className="font-medium text-[13px] text-custom-title-gray">
                  Available Balance
                </p>
              </div>
            )}

            {networks_available[sourceOptions.blockchain] && (
              <IconSelectBox
                options={sourceOptions.filteredNets}
                name="network"
                value={sourceOptions.network}
                placeholder="Select a Network"
                onChange={handleSourceChange}
                label="Select a Network"
              />
            )}

            <IconField
              value={data?.sourceAmount}
              label="Source Amount & Destination Amount"
              onChange={(e) => handleInputChange(e, "sourceAmount")}
            />

            <LoadingApi loading={isFeeLoading}>
              {destinationAmount && (
                <div className="mb-1">
                  <p className="text-black-100 font-medium">
                    {destinationAmount}
                  </p>
                  <p className="font-medium text-[13px] text-custom-title-gray">
                    Destination Amount
                  </p>
                </div>
              )}
            </LoadingApi>
            <ErrorApiText error={isFeeError} />

            <IconField
              value={data?.walletAddress}
              label="Recipient Wallet Address"
              placeholder="Wallet Address"
              onChange={(e) => handleInputChange(e, "walletAddress")}
            />

            <div className="mt-2">
              <label className="font-medium text-[15px] text-black-100">
                Enter Code{" "}
              </label>
              <OtpInput
                numInputs={6}
                containerStyle={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "6px",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="!w-10 md:!w-14 p-2 py-4 max-w-full md:p-4 rounded-large outline-none border border-light-gray bg-blackGrey-filled-input"
                  />
                )}
                onChange={(value) => setOtp(value)}
                value={otp}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium">Notes</label>

              <textarea
                value={data?.notes}
                placeholder="Your Message Here"
                onChange={(e) => handleInputChange(e, "notes")}
                className={`border-b border-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 bg-light-gray outline-none`}
              />
            </div>

            <div className="flex flex-col justify-end mt-4">
              <LoaderButton
                type="submit"
                content={`Create Withdrawal`}
                variant="contained"
                onClick={handleWithdrawal}
                loading={isWithdrawalLoading}
              />

              <button
                type="button"
                className="text-black-100 px-4 py-2 mt-2"
                onClick={toggleHandler}
              >
                Cancel
              </button>
            </div>
          </form>
        </LoadingApi>
        <ErrorApiText error={isBalanceError || isWithdrawalError} />
      </div>
    </Modal>
  );
};

export default CreateWithdrawalModal;
