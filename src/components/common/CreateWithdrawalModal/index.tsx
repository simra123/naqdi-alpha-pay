import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary
import IconSelectBox from "../IconSelectBox";
import { useRouter } from "next/navigation";
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

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const CreateWithdrawalModal = ({ isOpen, toggleHandler }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [balance, setBalance] = useState([]);
  const [destinationAmount, setDestinationAmount] = useState("0");
  const [withdrawalFee, setWithdrawalFee] = useState(0);
  const [isWithdrawalLoading, isWithdrawalError, callWithdrawalApi] = useApi();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isBalanceLoading, isBalanceError, callBalanceApi] = useApi(true);
  const [isFeeLoading, isFeeError, callFeeApi] = useApi(true);

  const [sourceOptions, setSourceOptions] = useState({
    filteredNets: [],
    blockchain: "",
    network: "",
    standard: "",
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
        })
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Created Successfully",
            status: "success",
          })
        );
        toggleWithdrawModal();
        router.push("/withdrawals");
      },
    });
  };

  useEffect(() => {
    _getUserBalance();
  }, []);

  useEffect(() => {
    getAlphasPayFee();
  }, [data.sourceAmount]);

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

  const toggleWithdrawModal = () => {
    setWithdrawOpen(!withdrawOpen);
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-8 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Add Withdrawal</h2>
        <form>
          <IconSelectBox
            label="Source Currency & Network"
            options={balance}
            name="blockchain"
            value={sourceOptions.blockchain}
            placeholder="Select a Blockchain"
            onChange={handleSourceChange}
          />

          {sourceOptions.blockchain && (
            <p className="note">
              <span className="font-bold">Available Balance : </span>
              {getCurrentAssetAmount(sourceOptions.blockchain)}
            </p>
          )}

          {networks_available[sourceOptions.blockchain] && (
            <IconSelectBox
              options={sourceOptions.filteredNets}
              name="network"
              value={sourceOptions.network}
              placeholder="Select a Network"
              onChange={handleSourceChange}
            />
          )}

          <IconField
            value={data?.sourceAmount}
            label="Source Amount"
            onChange={(e) => handleInputChange(e, "sourceAmount")}
          />

          <IconField
            value={data?.walletAddress}
            label="Wallet Address"
            onChange={(e) => handleInputChange(e, "walletAddress")}
          />

          <div className="flex flex-col gap-2">
            <label className="block mb-2 font-medium">Notes</label>

            <textarea
              value={data?.notes}
              onChange={(e) => handleInputChange(e, "notes")}
              className={`border-b border-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 bg-light-gray outline-none`}
            />
          </div>

          <div className="flex flex-col justify-end">
            <LoaderButton
              type="submit"
              className="mt-6"
              content={`Create Withdrawal`}
              variant="contained"
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
      </div>
    </Modal>
  );
};

export default CreateWithdrawalModal;
