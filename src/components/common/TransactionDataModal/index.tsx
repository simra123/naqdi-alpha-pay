"use client";
import React from "react";
import Modal from "../Modal";
import OTPInput from "react-otp-input";
import LoaderButton from "../LoaderButton";
import { Button } from "@mui/material";

import ErrorApiText from "../ErrorApiText";


type Props = {
  isOpen: boolean;
  handleClose: () => void;
  data: {
    amount: string;
    recipientAddress: string;
    fee: number;
    netAmount: number;
    network: string;
    blockchain: string;
    notes?: string;
    from_currency?: string;
    to_currency?: string;
    converted_amount?: string;
  };
  type?: string;
  buttonLoading: boolean;
  handleTransaction: () => void;
  transactionError: string | boolean;
};

const TransactionDataModal = ({
  isOpen,
  handleClose,
  data: {
    amount,
    blockchain,
    fee,
    netAmount,
    network,
    recipientAddress,
    notes,
    converted_amount,
    from_currency,
    to_currency,
  },
  type,
  buttonLoading,
  handleTransaction,
  transactionError,
}: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="min-h-full p-8 flex place-items-center place-content-center">
        <div className="flex gap-3  w-[650px] max-w-[75%]">
          <div className="request_box shadow-md-border py-6 bg-white gap-4">
            <div className="flex flex-col gap-3 px-4">
              <h3 className="font-bold text-lg">Create Withdrawal</h3>
            </div>
            <div className="modal_body mt-2">
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Withdrawal Amount
                </h5>
                <p className="text-[14px] primary-color">{amount}</p>
              </div>
              {/* <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Gross Amount
                </h5>
                <p className="text-[14px] primary-color">82.9 USDT</p>
              </div> */}
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Withdrawal Fee
                </h5>
                <p className="text-[14px] primary-color">{fee}</p>
              </div>
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Net Amount
                </h5>
                <p className="text-[14px] primary-color">{netAmount}</p>
              </div>
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  {type == "payout"
                    ? "Bank Account No."
                    : "Recipient Wallet Address"}
                </h5>
                <p className="text-[14px] primary-color break-words">
                  {recipientAddress}
                </p>
              </div>
              {type == "payout" && (
                <>
                  <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                    <h5 className="text-[14px] font-semibold primary-color">
                      From Currency
                    </h5>
                    <p className="text-[14px] primary-color">{from_currency}</p>
                  </div>
                  <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                    <h5 className="text-[14px] font-semibold primary-color">
                      To Currency
                    </h5>
                    <p className="text-[14px] primary-color">{to_currency}</p>
                  </div>
                  <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                    <h5 className="text-[14px] font-semibold primary-color">
                      Converted Amount ({to_currency})
                    </h5>
                    <p className="text-[14px] primary-color">
                      {converted_amount}
                    </p>
                  </div>
                </>
              )}
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Network
                </h5>
                <p className="text-[14px] primary-color">{network}</p>
              </div>
              <div className="data-row grid grid-cols-2 py-3 border-b px-5">
                <h5 className="text-[14px] font-semibold primary-color">
                  Disclaimer
                </h5>
                <p className="text-[14px] primary-color">
                  {type == "payout"
                    ? ` Please be advised if the conversion process is successful, you
                  will recieve the projected amount. The converted price is subjected to change at the time of approval due to changes in cryptocurrency value.`
                    : `
                  Please be advised if the conversion process is successful, you
                  will recieve the projected amount. In the event of an
                  unsuccessful conversion, there will be no effect on your
                  balance.
                  `}
                </p>
              </div>

              <div className="data-row flex items-baseline justify-between py-3 px-5">
                <h5 className="text-[14px] font-semibold primary-color">MFA</h5>
                <div className="flex flex-col gap-1">
                  <OTPInput
                    numInputs={6}
                    placeholder="XXXXXX"
                    containerStyle={{
                      display: "flex",

                      gap: "1.5rem",
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        disabled={false}
                        className="input-field min-w-14 p-4 outline-none"
                      />
                    )}
                    onChange={(value) => console.log(value)}
                    // value={}
                  />
                  <p className="note">
                    Enter your MFA code in order to proceed.
                  </p>
                </div>
              </div>

              <ErrorApiText error={transactionError} textClass="p-3" />

              <div className="flex gap-4 justify-end px-5">
                <Button variant="text" onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <LoaderButton
                  content={"Proceed"}
                  loading={buttonLoading}
                  onClick={handleTransaction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDataModal;
