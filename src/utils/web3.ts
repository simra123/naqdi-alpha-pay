import {isAddress} from "web3-validator";
import { validate } from "bitcoin-address-validation";
import { TronWeb } from "tronweb";

export const isValidTronAddress = (address) => {
  return TronWeb.isAddress(address);
};

export const isValidEthereumAddress = (address) => {
  return isAddress(address);
};

export const isValidBitcoinAddress = (address) => {
  return validate(address);
};

export const validateCryptoAddress = (address, blockchain) => {

  switch (blockchain.toLowerCase()) {
    case "eth":
      return isValidEthereumAddress(address);
    case "btc":
      return isValidBitcoinAddress(address);
    case "trx":
      return isValidTronAddress(address);
    default:
      return false;
  }
};
