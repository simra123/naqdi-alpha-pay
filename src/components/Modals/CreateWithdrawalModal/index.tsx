import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { networks_available, unitName } from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import {
  getAllAdminWalletBalancesApi,
  getAllWalletBalancesApi,
} from "@/services/wallet";
import {
  createAdminWithdrawalApi,
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
import { getAllWalletAssetsByAdminApi } from "@/services/admin/wallets";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import RenderRoleBased from "@/components/common/RenderRoleBased";

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
  const user = useLocalStorage("user");
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
    if (currentStep == 1) {
      const maxAmount = getCurrentAssetAmount(values?.blockchain);
      setCurrentSchema(getWithdrawalSchema(+maxAmount || 0));
    }
    if (currentStep == 2) {
      setCurrentSchema(otpSchema);
    }
  }, [values?.blockchain, currentStep]);

  const getBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(
        user?.role == Role.USER
          ? getWithdrawableCurrenciesListApi()
          : getAllAdminWalletBalancesApi()
      ),
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
            amount: item?.totalAmount || item?.amount,
          };
        });
        setBalance(withdraw_currency_options);
        if (blockchain) {
          setValues((pre) => ({ ...pre, blockchain }));
        }
      },
    });
  };

  const handleStepChange = (step: number) => () => {
    setCurrentStep(step);
    if (step == 2) {
      user?.role == Role.USER && getAlpapayFee({ amount: values?.amount });
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
  const getAlpapayFee = async ({ amount }) => {
    await callApiHook({
      apiCall: callFeeApi(getFeesApi(amount)),
      successCallBack: (response) => {
        setFee(response);
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setBalanceError(null);
      setWithdrawalError(null);
      getBalance();
      setCurrentStep(1);
      setValues(initalFormValues); // Reset form values
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">
        {currentStep == 1 ? "Create" : "Confirm"} Withdrawal
      </h2>

      <LoadingApi loading={isBalanceLoading}>
        {currentStep == 1 && (
          <form
            className="flex flex-col gap-2 mt-8"
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
                <p className="font-medium text-black-100">
                  {
                    balance.find((item) => item.value === values.blockchain)
                      ?.amount
                  }
                </p>
                <p className="font-semibold text-[13px] text-custom-title-gray">
                  {user?.role == Role.USER
                    ? "Available Balance"
                    : "Available Fee"}
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
            className="flex flex-col gap-2 mt-8"
            onSubmit={(e) =>
              handleSubmit(e, handleWithdrawal, () =>
                console.log("Something went wrong")
              )
            }
          >
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Blockchain
                </p>
                <p className="font-medium text-black-100">
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
                <p className="font-medium text-black-100">
                  {formattedBlockchainName(values?.blockchain)?.ticker}
                </p>
              </div>
              <div>
                <p className="font-bold text-caption text-custom-title-gray">
                  Requested Amount
                </p>
                <p className="font-medium text-black-100">
                  {roundToPrecision(+values?.amount, 10)}
                </p>
              </div>
              <RenderRoleBased user={user} allowedRoles={[Role.USER]}>
                <div>
                  <p className="font-bold text-caption text-custom-title-gray">
                    Alphapay Fee
                  </p>
                  <p className="font-medium text-black-100">
                    {roundToPrecision(+fee?.alphaspayFees, 10)}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-caption text-custom-title-gray">
                    Net Amount
                  </p>
                  <p className="font-medium text-black-100">
                    {roundToPrecision(+fee?.netAmount, 10)}
                  </p>
                </div>
              </RenderRoleBased>
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
                  <Info className="mb-1 text-[18px] text-blue-info" />
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
      <ErrorApiText error={isBalanceError || isFeeError || isWithdrawalError} />
    </Modal>
  );
};

export default CreateWithdrawalModal;
