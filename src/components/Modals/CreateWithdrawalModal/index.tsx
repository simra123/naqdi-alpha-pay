import React, { useEffect, useState } from "react";

import Modal from "../Modal";
import IconSelectBox from "../../common/IconSelectBox";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { networks_available } from "@/constants/blockchains";
import { callApiHook } from "@/utils/apifuncs";
import { getAllWalletBalancesApi } from "@/services/wallet";
import { createWithdrawalApi } from "@/services/withdrawal";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import LoadingApi from "../../common/LoadindApi";
import ErrorApiText from "../../common/ErrorApiText";
import OtpInput from "react-otp-input";
import { Info } from "@mui/icons-material";
import useFormValidation from "@/hooks/useFormValidation";
import { emptySchema, getWithdrawalSchema } from "@/models/withdrawal";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshHandler: () => void;
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
}: Props) => {
  const dispatch = useDispatch();

  const [balance, setBalance] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(emptySchema);

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
    const maxAmount = getCurrentAssetAmount(values?.blockchain);
    setCurrentSchema(
      getWithdrawalSchema(
        !!networks_available[values?.blockchain],
        +maxAmount || 0
      )
    );
  }, [values]);

  const _getUserBalance = async () => {
    await callApiHook({
      apiCall: callBalanceApi(getAllWalletBalancesApi()),
      successCallBack: (response: any) => {
        const withdraw_currency_options = response.map((item) => {
          return {
            label: item?.standard
              ? `${item?.unit} (${item?.standard})`
              : item?.unit,
            value: item?.standard
              ? `${item?.unit} (${item?.standard})`
              : item?.unit,
            standard: item?.standard,
            unit: item?.unit,
            amount: item?.amount,
          };
        });
        setBalance(withdraw_currency_options);
      },
    });
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

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setBalanceError(null);
      setWithdrawalError(null);
      _getUserBalance();
      setValues(initalFormValues); // Reset form values
    }
  }, [isOpen]);

  console.log(errors);

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="text-h3.5 font-semibold mb-4">Add Withdrawal</h2>

      <LoadingApi loading={isBalanceLoading}>
        <form
          className="mt-8 flex flex-col gap-2"
          onSubmit={(e) =>
            handleSubmit(e, handleWithdrawal, () =>
              console.log("Something went wrong")
            )
          }
        >
          <IconSelectBox
            wrapperClassName="!mb-2"
            label="Source Currency & Network"
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
              <p className="font-medium text-[13px] text-custom-title-gray">
                Available Balance
              </p>
            </div>
          )}

          <IconField
            value={values.amount}
            label="Source Amount"
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
            error={errors.recipient_address}
          />

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
              loading={isWithdrawalLoading}
            />
            {/* <button
              type="button"
              className="text-black-100 px-4 py-2 mt-2"
              onClick={toggleHandler}
            >
              Cancel
            </button> */}
          </div>
        </form>
      </LoadingApi>
      <ErrorApiText error={isBalanceError || isWithdrawalError} />
    </Modal>
  );
};

export default CreateWithdrawalModal;
