import { networks_available } from "@/constants/blockchains";
import * as Yup from "yup";

export const ExternalWithdrawal = Yup.object().shape({
  transactionHash: Yup.string().required("Transaction Hash is required"),
  senderAddress: Yup.string().required("Sender Address is required"),
  internalNote: Yup.string().notRequired(),
  externalNote: Yup.string().notRequired(),
});
