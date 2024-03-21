"use client";
import api, { formHeader } from "@/config/api";

/* 
                        Client APIS BELOW
 _____________________________________________________________________ 
 
 */

export const loginApi = (data) => {
  return () => api.post(`user/login`, data);
};

export const registerClientApi = (data) => {
  return () => api.post(`user/register_client`, data, { ...formHeader });
};

export const updateClientApi = (data, id) => {
  return () => api.put(`user/update-client/${id}`, data, { ...formHeader });
};

/*                       ADMIN APIS BELOW
 _____________________________________________________________________ 
 
 */

export const adminRegisterApi = (data) => {
  return () => api.post(`user/register_admin`, data, { ...formHeader });
};
