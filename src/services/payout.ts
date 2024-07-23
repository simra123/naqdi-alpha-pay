import api from "@/config/api";

export const createPayoutRequestApi = (data: {
  unit: string;
  requested_currency: string;
  bank_account: string;
  account_title: string;
  amount: string;
  standard?: string;
}) => {
  return () => api.post(`payouts/create`, data);
};

export const payoutDetailsApis = (data: { payout_id: number }) => {
  return () => api.post(`payouts/payout-details`, data);
};

export const listAdminPayoutsApi = () => {
  return () => api.get(`payouts/all-payouts`);
};

export const listUserPayoutsApi = () => {
  return () => api.get(`payouts/user-payouts`);
};

export const rejectPayoutApi = (data: {
  payout_id: number;
  reason: string;
}) => {
  return () => api.post(`payouts/user-payouts`, data);
};

export const approvePayoutApi = (data: {
  payout_id: number;
  sender_address: string;
}) => {
  return () => api.post(`payouts/approve-payout`, data);
};
