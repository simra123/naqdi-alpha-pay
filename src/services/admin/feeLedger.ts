"use client";

import api from "@/config/api";

export const getAdminLedgerListApi = () => {
  return () => api.get(`admin/ledger-fee`, { params: { all: true } });
};
