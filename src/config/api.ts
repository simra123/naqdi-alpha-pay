import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to modify the headers
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    // Set the bearer token in the headers
    config.headers["Authorization"] = `bearer ` + token;
  }

  return config;
});

export default api;

// OTHER CONFIGS
export const formHeader = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
