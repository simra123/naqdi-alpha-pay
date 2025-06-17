import { networks_available } from "@/constants/blockchains";
import { validateCryptoAddress } from "@/utils/web3";
import * as Yup from "yup";

export const ExternalWithdrawal = (blockchainTicker) => {
  return Yup.object().shape({
    transactionHash: Yup.string().required("Transaction Hash is required"),
    senderAddress: Yup.string()
      .required("Wallet address is required")
      .test("is-valid-crypto-address", function (value) {
        const isValid = validateCryptoAddress(value, blockchainTicker);

        if (!isValid) {
          return this.createError({
            message: `Invalid wallet address for the selected blockchain: ${blockchainTicker}`,
          });
        }

        return true;
      }),
    internalNote: Yup.string().notRequired(),
  });
};
