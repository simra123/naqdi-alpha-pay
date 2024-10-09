import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import {
  blockchain_standards,
  networks_available,
  production_networks,
  testnet_networks,
} from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import { getFeesApi } from "@/services/common";
import { createWithdrawalApi } from "@/services/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import { clamp } from "@/utils/math";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import { Info } from "@mui/icons-material";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
}

interface Network {
  label: string;
  value: string;
  standard?: string;
}

const CreateWithdrawalModal = ({
  isOpen,
  toggleHandler,
  refreshHandler,
}: Props) => {
  const dispatch = useDispatch();
  const debounceTimeout = useRef(null);
  const [balance, setBalance] = useState([]);
  const [networks, setNeworks] = useState<Record<string, Network[]>>({});
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

  useEffect(() => {
    setNeworks(
      process.env.NEXT_PUBLIC_ENVIRONMENT == "dev"
        ? testnet_networks
        : production_networks
    );
  }, []);

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
        const withdraw_currency_options = response.map((item) => {
          return {
            label: item?.unit,
            value: item?.unit,
            amount: item?.amount,
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

    const withdraw_request_payload = {
      amount: data?.sourceAmount,
      recipient_address: data.walletAddress,
      blockchain: sourceOptions.blockchain,
      notes: data.notes,
      standard: networks_available[sourceOptions.blockchain]
        ? sourceOptions.standard
        : null,
      token: otp,
    }

    if (withdraw_request_payload.standard == null) {
      delete withdraw_request_payload.standard
    }


    await callApiHook({
      apiCall: callWithdrawalApi(
        createWithdrawalApi(withdraw_request_payload)
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

    if (name === "sourceAmount") {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      setData((prev) => ({ ...prev, [name]: value }));

      debounceTimeout.current = setTimeout(() => {
        const maxVal = clamp(
          parseFloat(value),
          getCurrentAssetAmount(sourceOptions.blockchain)
        );
        setData((prev) => ({ ...prev, [name]: maxVal }));
      }, 500); // 500ms debounce delay
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filteredNetworks = (network, blockchain) => {


    return networks[blockchain].find((item) => item.value == network)?.standard;
  };

  const getCurrentAssetAmount = (value) => {
    return balance.find((item) => item.value == value)?.amount;
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-6 md:p-10 rounded-md shadow-lg w-[547px] max-w-[90%] my-4">
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
              <div className="flex gap-2 items-center">
                <label className="block mb-2 font-medium">Enter Code</label>

                <div className="relative flex items-center group">
                  <Info className="text-blue-info mb-1 text-[18px]" />

                  <div className="absolute w-96 bg-dark-gray text-white text-sm -top-[112px] rounded-large py-2 -left-[50px] hidden group-hover:block transition-opacity duration-200">
                    <div className="relative p-2">
                      <p className="w-full text-center">
                        Use your Google Autheticator code here
                      </p>
                      <div className="absolute polygon-clip bg-dark-gray w-[50px] h-[50px] rounded-large left-[33px] -bottom-[38px]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <OtpInput
                numInputs={6}
                containerStyle={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "6px",
                  flexWrap: "wrap",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="!w-14 p-2 py-4 max-w-full md:p-4 rounded-large outline-none border border-light-gray bg-blackGrey-filled-input"
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
