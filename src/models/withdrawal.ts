import * as Yup from "yup";
import { validateCryptoAddress } from "@/utils/web3";
import {
  capitalize,
  formattedBlockchainName,
  removeBrackets,
} from "@/utils/dataFormatters";
import {
  standardBlockchain,
  tickerByStandard,
  unitName,
} from "@/constants/blockchains";

let contextTest;

export const getWithdrawalSchema = (maxSourceAmount: number) => {
  return Yup.object().shape({
    blockchain: Yup.string().required("Blockchain is required"),
    amount: Yup.number()
      .typeError("Entered value must not be empty and should be a number")
      .min(0.0001)
      .max(
        maxSourceAmount,
        `Source amount must be equal or less than ${maxSourceAmount}`
      )
      .required("Source amount is required"),
    recipient_address: Yup.string()
      .required("Wallet address is required")
      .test("is-valid-crypto-address", function (value) {
        const parent = this.options.context?.parent || {};

        const blockchain = formattedBlockchainName(parent?.blockchain);

        const isValid = validateCryptoAddress(
          value,
          blockchain.standard
            ? tickerByStandard[blockchain?.standard]
            : blockchain?.ticker
        );

        if (!isValid) {
          return this.createError({
            message: `Invalid wallet address for the selected blockchain: ${
              blockchain?.standardBlockchain
                ? capitalize(blockchain?.standardBlockchain)
                : blockchain?.name
            }`,
          });
        }

        return true;
      }),
    notes: Yup.string().notRequired(),
  });
};

export const otpSchema = () => {
  return Yup.object().shape({
    token: Yup.string()
      .required("Token is required")
      .length(6, "Token must be exactly 6 characters long"),
  });
};

console.log({ contextTest });

export const emptySchema = Yup.object().shape({});
