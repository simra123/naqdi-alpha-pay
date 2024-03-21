"use client";
import axios from "axios";

const API_URL = "BASE_URL";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to modify the headers
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user?.token) {
      // Set the bearer token in the headers
      config.headers["Authorization"] = user?.token;
    }
  } catch (error) {
    console.error(error, "Error while setting Authorization header");
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
