import { min } from 'moment';
import * as Yup from 'yup';

export const getWithdrawalSchema = (maxSourceAmount: number) => {
    return Yup.object().shape({
        blockchain: Yup.string().required("Blockchain is required"),
        token: Yup.string().required("Token is required").length(6, "Token must be exactly 6 characters long"),
        amount: Yup.number().min(0.0001).max(maxSourceAmount, `Source amount must be equal or less than ${maxSourceAmount}`).required("Source amount is required"),
        recipient_address : Yup.string().required("Wallet address is required"),
        notes: Yup.string().notRequired(),
    });
};

export const emptySchema = Yup.object().shape({});
