import { min } from 'moment';
import * as Yup from 'yup';

export const getWithdrawalSchema = (network: boolean, maxSourceAmount: number) => {
    return Yup.object().shape({
        blockchain: Yup.string().required("Blockchain is required"),
        network: network ? Yup.string().required() : Yup.string().notRequired(),
        token: Yup.string().required("Token is required").length(6, "Token must be exactly 6 characters long"),
        amount: Yup.number().transform((value, originalValue) => (originalValue === '' ? undefined : value)).min(0.0001).max(maxSourceAmount, `Source amount must be equal or less than ${maxSourceAmount}`).required("Source amount is required"),
        recipient_address : Yup.string().required("Wallet address is required"),
        notes: Yup.string().notRequired(),
    });
};

export const emptySchema = Yup.object().shape({});
