import axios from "axios";

const API_URL = "http://91.108.110.23:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to modify the headers
api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.token) {
        // Set the bearer token in the headers
        config.headers["Authorization"] = user.token;
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      console.error(error, "Error while setting Authorization header");
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 error (Unauthorized)
      console.error("Unauthorized request. Please login again.");
      // You can redirect to login page or handle it as per your requirement
    }
    return Promise.reject(error);
  }
);

export default api;

// OTHER CONFIGS
export const formHeader = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
