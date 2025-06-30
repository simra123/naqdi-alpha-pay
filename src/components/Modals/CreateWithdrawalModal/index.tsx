import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { networks_available, unitName } from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import {
  getAdminFiatBalanceApi,
  getAdminSupportedCryptoApi,
  getAllAdminWalletBalancesApi,
} from "@/services/admin/wallet";
import {
  createWithdrawalApi,
  getWithdrawableCurrenciesListApi,
} from "@/services/withdrawal";
import { createAdminWithdrawalApi } from "@/services/admin/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import useFormValidation from "@/hooks/useFormValidation";
import {
  emptySchema,
  getWithdrawalSchema,
  otpSchema,
} from "@/models/withdrawal";
import { getFeesApi } from "@/services/common";
import { roundToPrecision } from "@/utils/math";
import { capitalize, formattedBlockchainName } from "@/utils/dataFormatters";
import { getLocalStorageValue } from "@/utils/cookies";
import { Role } from "@/constants/roles";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import { MdInfo } from "react-icons/md";
import {
  getMerchantFiatBalanceApi,
  getMerchantSupportedCryptoApi,
} from "@/services/wallet";
import AmountFormat from "@/components/common/AmountFormat";
import { formatAmount } from "@/components/common/AmountFormat/utils";
import { userDetailsApi } from "@/services/user";
import { getExxhangeRateUSDToCryptoApi } from "@/services/transaction";
import { getAdminExchangeRateUSDToCryptoApi } from "@/services/admin/transaction";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
  blockchain?: string;
  standard?: string;
}
interface SummaryState {
  requestedAmount: number;
  feePercentage: number;
  fiatFeeAmount: number;
  fiatNetAmount: number;
  cryptoRequstedAmount: number;
  cryptoFeeAmount: number;
  cryptoNetAmount: number;
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
  standard,
}: Props) => {
  const dispatch = useDispatch();
  const user = getLocalStorageValue("user");
  const [supportedCurrencies, setSupportedCurrencies] = useState<any>([]);
  const [balance, setBalance] = useState<any>({});
  const [withdrawSummary, setWithdrawSummary] = useState<SummaryState>({
    cryptoFeeAmount: 0,
    cryptoNetAmount: 0,
    cryptoRequstedAmount: 0,
    feePercentage: 0,
    fiatFeeAmount: 0,
    fiatNetAmount: 0,
    requestedAmount: 0,
  });
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

  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi();
  const [isExchangeRateLoading, isExchangeRateError, callExchangeRateApi] =
    useApi();

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
    if (currentStep == 1) {
      const currentCurrency = getSelectedCurrency(
        values?.blockchain
      )?.blockchain;

      setCurrentSchema(
        getWithdrawalSchema(
          +formatAmount({
            amount:
              parseFloat(balance?.total_amount) -
              parseFloat(balance?.on_hold_amount),
            type: "fiat",
          })?.fixedRaw,
          currentCurrency
        )
      );
    }
    if (currentStep == 2) {
      setCurrentSchema(otpSchema);
    }
  }, [values?.blockchain, currentStep, blockchain]);

  const getSelectedCurrency = (label: string) => {
    return supportedCurrencies?.find((item) => item?.label == label);
  };

  const getSupportedCurrencies = async () => {
    await callApiHook({
      apiCall: callBalanceApi(
        user?.role == Role.USER
          ? getMerchantSupportedCryptoApi()
          : getAdminSupportedCryptoApi()
      ),
      successCallBack: (response: any) => {
        let data = response?.data || response;
        setSupportedCurrencies(
          data?.map((item) => ({
            ...item,
            label:
              item?.is_token && item?.standard
                ? `${item?.unit} (${item?.standard})`
                : capitalize(item?.blockchain_name),
            value:
              item?.is_token && item?.standard
                ? `${item?.unit} (${item?.standard})`
                : capitalize(item?.blockchain_name),
          }))
        );

        const currencyName = standard
          ? blockchain?.toUpperCase()
          : unitName[blockchain];

        setValues({
          ...initalFormValues,
          blockchain: standard ? `${currencyName} (${standard})` : currencyName,
        }); // Reset form values
      },
    });
  };

  const getBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(
        user?.role == Role.USER
          ? getMerchantFiatBalanceApi()
          : getAdminFiatBalanceApi()
      ),
      successCallBack: (response: any) => {
        setBalance(response?.data || response);
      },
    });
  };

  const getUserDetails = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callUserDetailsApi(userDetailsApi()),
        successCallBack: async (response) => {
          const requestedAmount = values?.amount;
          const feePercentage = +response?.company?.fee;
          const feeAmount = (requestedAmount / 100) * feePercentage;
          const netAmount = requestedAmount - feeAmount;
          await getExchangeRate(
            {
              amount: netAmount,
              blockchain: getSelectedCurrency(values.blockchain)
                ?.blockchain_name,
              unit: getSelectedCurrency(values.blockchain)?.unit,
            },
            { requestedAmount, feePercentage, feeAmount, netAmount }
          );
        },
      });
    }
  };

  const getExchangeRate = async (
    {
      amount,
      blockchain,
      unit,
    }: {
      amount: number;
      blockchain: string;
      unit: string;
    },
    data: {
      requestedAmount: number;
      feePercentage: number;
      feeAmount: number;
      netAmount: number;
    }
  ) => {
    let response;
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callExchangeRateApi(
          getExxhangeRateUSDToCryptoApi({ amount, blockchain, unit })
        ),
        successCallBack: (response) => {
          const { exchangeRate, cryptoAmount } = response;
          setWithdrawSummary({
            cryptoFeeAmount: exchangeRate * data.feeAmount,
            cryptoNetAmount: cryptoAmount,
            cryptoRequstedAmount: +data.requestedAmount * exchangeRate,
            feePercentage: data.feePercentage,
            fiatFeeAmount: data.feeAmount,
            fiatNetAmount: data.netAmount,
            requestedAmount: data.requestedAmount,
          });
        },
      });
    }
    if (user?.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callExchangeRateApi(
          getAdminExchangeRateUSDToCryptoApi({ amount, blockchain, unit })
        ),
        successCallBack: (response) => {
          const { exchangeRate, cryptoAmount } = response;
          setWithdrawSummary({
            cryptoFeeAmount: exchangeRate * data.feeAmount,
            cryptoNetAmount: cryptoAmount,
            cryptoRequstedAmount: +data.requestedAmount * exchangeRate,
            feePercentage: data.feePercentage,
            fiatFeeAmount: data.feeAmount,
            fiatNetAmount: data.netAmount,
            requestedAmount: data.requestedAmount,
          });
        },
      });
    }
  };

  const handleStepChange = (step: number) => () => {
    setCurrentStep(step);
    if (step == 2) {
      if (user?.role == Role.USER) {
        getUserDetails();
      }
      if (user?.role == Role.ADMIN) {
        getExchangeRate(
          {
            amount: values?.amount,
            blockchain: getSelectedCurrency(values.blockchain)?.blockchain_name,
            unit: getSelectedCurrency(values.blockchain)?.unit,
          },
          {
            requestedAmount: values?.amount,
            feePercentage: 0,
            feeAmount: 0,
            netAmount: values?.amount,
          }
        );
      }
    }
  };

  const handleWithdrawal = async () => {
    const currency = getSelectedCurrency(values?.blockchain);

    const withdraw_request_payload = {
      ...values,
      unit: currency?.unit,
      standard: currency?.standard,
      amount: +values?.amount,
    };

    if (withdraw_request_payload.standard == null) {
      delete withdraw_request_payload.standard;
    }

    await callApiHook({
      apiCall: callWithdrawalApi(
        user?.role == Role.USER
          ? createWithdrawalApi(withdraw_request_payload)
          : createAdminWithdrawalApi(withdraw_request_payload)
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
      const currencyName = standard
        ? blockchain?.toUpperCase()
        : unitName[blockchain];
      setErrors({});
      setBalanceError(null);
      setWithdrawalError(null);
      getBalance();
      setCurrentStep(1);
      getSupportedCurrencies();
      if (!blockchain) {
        setValues({
          ...initalFormValues,
        }); // Reset form values
      }
    }
  }, [isOpen]);

  console.log({ withdrawSummary });

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">
        {currentStep == 1 ? "Create" : "Confirm"} Withdrawal
      </h2>

      <LoadingApi loading={isBalanceLoading}>
        {currentStep == 1 && (
          <form
            className="flex flex-col gap-2 mt-8"
            onSubmit={(e) => handleSubmit(e, handleStepChange(2))}
          >
            <IconSelectBox
              wrapperClassName="!mb-2"
              label="Withdraw Currency"
              options={supportedCurrencies}
              name="blockchain"
              value={values.blockchain}
              placeholder="Select a Blockchain"
              onChange={handleChange}
              error={errors.blockchain}
            />

            <div className="flex items-center gap-8">
              {balance?.currency && (
                <>
                  <div className="mb-1">
                    <p className="font-medium text-black-100">
                      <AmountFormat
                        amount={
                          parseFloat(balance?.total_amount) -
                          parseFloat(balance.on_hold_amount)
                        }
                        type="fiat"
                        currency={balance.currency}
                      />
                    </p>
                    <p className="font-semibold text-[13px] text-custom-title-gray">
                      {user?.role == Role.USER
                        ? "Available Balance"
                        : "Available Fee"}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="font-medium text-black-100">
                      <AmountFormat
                        amount={parseFloat(balance.on_hold_amount)}
                        type="fiat"
                        currency={balance.currency}
                      />
                    </p>
                    <p className="font-semibold text-[13px] text-custom-title-gray">
                      On Hold Amount
                    </p>
                  </div>
                </>
              )}
            </div>

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
        <LoadingApi loading={isUserDetailsLoading || isExchangeRateLoading}>
          <form
            className="flex flex-col gap-2 mt-8"
            onSubmit={(e) => handleSubmit(e, handleWithdrawal)}
          >
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Blockchain
                </p>
                <p className="font-medium text-black-100 capitalize">
                  {getSelectedCurrency(values.blockchain)?.blockchain_name}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Currency
                </p>
                <p className="font-medium text-black-100">
                  {getSelectedCurrency(values.blockchain)?.unit}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Fiat Requested Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.requestedAmount}
                    type="fiat"
                  />
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Crypto Requested Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.cryptoRequstedAmount}
                    type="crypto"
                  />
                </p>
              </div>

              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Fiat Fee Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.fiatFeeAmount}
                    type="fiat"
                  />
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Crypto Fee Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.cryptoFeeAmount}
                    type="crypto"
                  />
                </p>
              </div>

              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Fiat Net Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.fiatNetAmount}
                    type="fiat"
                  />
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Crypto Net Amount
                </p>
                <p className="font-medium text-black-100">
                  <AmountFormat
                    amount={withdrawSummary.cryptoNetAmount}
                    type="crypto"
                  />
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className="font-bold text-caption text-custom-title-gray">
                Recipient Address
              </p>
              <p className="font-medium text-black-100 break-all">
                {values?.recipient_address}
              </p>
            </div>
            <div className="mt-3">
              <p className="font-bold text-caption text-custom-title-gray">
                Your Notes
              </p>
              <p className="font-medium text-black-100 break-all">
                {values?.notes}
              </p>
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-2">
                <label className="block mb-2 font-medium">Enter Code</label>
                <div className="group relative flex items-center">
                  <MdInfo className="mb-1 text-[18px] text-blue-info" />
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
                    className="bg-blackGrey-filled-input p-2 md:p-4 py-4 border border-light-gray rounded-large outline-none !w-14 max-w-full"
                    disabled={!user?.userDetails?.mfa}
                  />
                )}
                onChange={(otp) => setValues((pre) => ({ ...pre, token: otp }))}
                value={values?.token}
              />
            </div>
            {errors?.token && (
              <p className="ml-3 text-[12px] text-red-error-dark">
                {errors?.token}
              </p>
            )}

            <div className="flex flex-col justify-end mt-4">
              {!user?.userDetails?.mfa ? (
                <div className="mt-2 text-button text-red-error-dark">
                  To create a withdrawal request, please enable MFA in your
                  account settings.
                </div>
              ) : (
                <LoaderButton
                  type="submit"
                  content="Confirm Withdrawal"
                  loading={isWithdrawalLoading}
                  variant="contained"
                />
              )}
              {!isWithdrawalLoading && (
                <LoaderButton
                  content="Back"
                  variant="text"
                  className="mt-2 w-full"
                  onClick={handleStepChange(1)}
                />
              )}
            </div>
          </form>
        </LoadingApi>
      )}
      <ErrorApiText
        error={
          isBalanceError ||
          isUserDetailsError ||
          isExchangeRateError ||
          isWithdrawalError
        }
      />
    </Modal>
  );
};

export default CreateWithdrawalModal;
