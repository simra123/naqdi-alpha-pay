import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { networks_available, unitName } from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import {
  createWithdrawalApi,
  getWithdrawableCurrenciesListApi,
} from "@/services/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import { Info } from "@mui/icons-material";
import useFormValidation from "@/hooks/useFormValidation";
import {
  emptySchema,
  getWithdrawalSchema,
  otpSchema,
} from "@/models/withdrawal";
import { getFeesApi } from "@/services/common";
import { roundToPrecision } from "@/utils/math";
import { capitalize, formattedBlockchainName } from "@/utils/dataFormatters";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
  blockchain?: string;
}

interface FeeState {
  alphaspayFees: string;
  netAmount: string;
}

const initalFormValues = {
  blockchain: "",
  token: "",
  amount: 0,
  recipient_address: "",
  notes: "",
};

const CreateWithdrawalModal = ({
  isOpen,
  toggleHandler,
  refreshHandler,
  blockchain,
}: Props) => {
  const dispatch = useDispatch();

  const [balance, setBalance] = useState([]);
  const [fee, setFee] = useState<null | FeeState>(null);
  const [currentSchema, setCurrentSchema] = useState(emptySchema);
  const [currentStep, setCurrentStep] = useState(1);

  const [
    isWithdrawalLoading,
    isWithdrawalError,
    callWithdrawalApi,
    setWithdrawalError,
  ] = useApi();
  const [isBalanceLoading, isBalanceError, callBalanceApi, setBalanceError] =
    useApi({
      initailLoading: true,
    });
  const [isFeeLoading, isFeeError, callFeeApi] = useApi();

  const getCurrentAssetAmount = (value) => {
    return balance.find((item) => item.value == value)?.amount;
  };

  // Initialize useFormValidation
  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    setValues,
    validateField,
    setErrors,
  } = useFormValidation(initalFormValues, currentSchema);

  useEffect(() => {
    console.log("updating schema");
    if (currentStep == 1) {
      const maxAmount = getCurrentAssetAmount(values?.blockchain);
      setCurrentSchema(getWithdrawalSchema(+maxAmount || 0));
    }
    if (currentStep == 2) {
      setCurrentSchema(otpSchema);
    }
  }, [values?.blockchain, currentStep]);

  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getWithdrawableCurrenciesListApi()),
      successCallBack: (response: any) => {
        const withdraw_currency_options = response.map((item) => {
          return {
            label: item?.standard
              ? `${item?.unit} (${item?.standard})`
              : unitName[item?.unit?.toLowerCase()],
            value: item?.standard
              ? `${capitalize(item?.unit)} (${item?.standard})`
              : item?.unit,
            standard: item?.standard,
            unit: item?.unit,
            amount: item?.amount,
          };
        });
        setBalance(withdraw_currency_options);
        if (blockchain) {
          setValues((pre) => ({ ...pre, blockchain }));
        }
        console.log(withdraw_currency_options);
      },
    });
  };

  const handleStepChange = (step: number) => () => {
    setCurrentStep(step);
    if (step == 2) {
      getAlpapayFee({ amount: values?.amount });
    }
  };

  const getcurrentAsset = () =>
    balance.find((item) => item?.value == values?.blockchain);

  const handleWithdrawal = async () => {
    const currentAsset = getcurrentAsset();
    const withdraw_request_payload = {
      ...values,
      // standard: networks_available[values.blockchain] ? values.standard : null,
      blockchain: currentAsset?.unit,
      standard: currentAsset?.standard || null,
    };

    console.log(withdraw_request_payload, "before removing null standard");

    if (withdraw_request_payload.standard == null) {
      delete withdraw_request_payload.standard;
    }
    console.log(withdraw_request_payload, "After removing null standard");

    await callApiHook({
      apiCall: callWithdrawalApi(createWithdrawalApi(withdraw_request_payload)),
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
  const getAlpapayFee = async ({ amount }) => {
    await callApiHook({
      apiCall: callFeeApi(getFeesApi(amount)),
      successCallBack: (response) => {
        setFee(response);
        console.log("Setting Fee ", response);
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setBalanceError(null);
      setWithdrawalError(null);
      _getUserBalance();
      setCurrentStep(1);
      setValues(initalFormValues); // Reset form values
    }
  }, [isOpen]);

  console.log(errors);

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="text-h3.5 font-semibold mb-4">
        {currentStep == 1 ? "Create" : "Confirm"} Withdrawal
      </h2>

      <LoadingApi loading={isBalanceLoading}>
        {currentStep == 1 && (
          <form
            className="mt-8 flex flex-col gap-2"
            onSubmit={(e) =>
              handleSubmit(e, handleStepChange(2), () =>
                console.log("Something went wrong")
              )
            }
          >
            <IconSelectBox
              wrapperClassName="!mb-2"
              label="Source Currency"
              options={balance}
              name="blockchain"
              value={values.blockchain}
              placeholder="Select a Blockchain"
              onChange={handleChange}
              error={errors.blockchain}
            />

            {values.blockchain && (
              <div className="mb-1">
                <p className="text-black-100 font-medium">
                  {
                    balance.find((item) => item.value === values.blockchain)
                      ?.amount
                  }
                </p>
                <p className="font-semibold text-[13px] text-custom-title-gray">
                  Available Balance
                </p>
              </div>
            )}

            <IconField
              value={values.amount}
              label="Withdrawal Amount"
              onChange={handleChange}
              name="amount"
              type="number"
              disabled={!values?.blockchain}
              onBlur={validateField}
              error={errors.amount}
            />

            <IconField
              value={values.recipient_address}
              label="Recipient Wallet Address"
              placeholder="Wallet Address"
              onChange={handleChange}
              name="recipient_address"
              onBlur={validateField}
              error={errors.recipient_address}
            />

            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                value={values.notes}
                name="notes"
                placeholder="Your Message Here"
                onChange={handleChange}
                className={`border-b border-gray p-4 resize-none text-gray-400 font-medium w-full min-h-36 bg-light-gray outline-none`}
              />
            </div>

            <div className="flex flex-col justify-end mt-4">
              <LoaderButton
                type="submit"
                content="Create Withdrawal"
                variant="contained"
              />
            </div>
          </form>
        )}
      </LoadingApi>
      {currentStep == 2 && (
        <LoadingApi loading={isFeeLoading}>
          <form
            className="mt-8 flex flex-col gap-2"
            onSubmit={(e) =>
              handleSubmit(e, handleWithdrawal, () =>
                console.log("Something went wrong")
              )
            }
          >
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Blockchain
                </p>
                <p className="text-black-100 font-medium">
                  {formattedBlockchainName(values?.blockchain)
                    ?.standardBlockchain
                    ? capitalize(
                        formattedBlockchainName(values?.blockchain)
                          ?.standardBlockchain
                      )
                    : formattedBlockchainName(values?.blockchain)?.name}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Currency
                </p>
                <p className="text-black-100 font-medium">
                  {formattedBlockchainName(values?.blockchain)?.ticker}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Requested Amount
                </p>
                <p className="text-black-100 font-medium">
                  {roundToPrecision(+values?.amount, 10)}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Alphapay Fee
                </p>
                <p className="text-black-100 font-medium">
                  {roundToPrecision(+fee?.alphaspayFees, 10)}
                </p>
              </div>

              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Net Amount
                </p>
                <p className="text-black-100 font-medium">
                  {roundToPrecision(+fee?.netAmount, 10)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="font-bold text-caption text-custom-title-gray">
                Recipient Address
              </p>
              <p className="text-black-100 font-medium break-all">
                {values?.recipient_address}
              </p>
            </div>
            <div className="mt-3">
              <p className="font-bold text-caption text-custom-title-gray">
                Your Notes
              </p>
              <p className="text-black-100 font-medium break-all">
                {values?.notes}
              </p>
            </div>

            <div className="mt-2">
              <div className="flex gap-2 items-center">
                <label className="block mb-2 font-medium">Enter Code</label>
                <div className="relative flex items-center group">
                  <Info className="text-blue-info mb-1 text-[18px]" />
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
                onChange={(otp) => setValues((pre) => ({ ...pre, token: otp }))}
                value={values?.token}
              />
            </div>
            {errors?.token && (
              <p className="text-red-error-dark text-[12px] ml-3">
                {errors?.token}
              </p>
            )}

            <div className="flex flex-col justify-end mt-4">
              <LoaderButton
                type="submit"
                content="Confirm Withdrawal"
                loading={isWithdrawalLoading}
                variant="contained"
              />
              {!isWithdrawalLoading && (
                <LoaderButton
                  content="Back"
                  variant="text"
                  className="w-full mt-2"
                  onClick={handleStepChange(1)}
                />
              )}
            </div>
          </form>
        </LoadingApi>
      )}
      <ErrorApiText error={isBalanceError || isFeeError || isWithdrawalError} />
    </Modal>
  );
};

export default CreateWithdrawalModal;
