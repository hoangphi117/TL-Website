import axios from "axios";
import type { AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle response & errors)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if(error.status === 401 && error.message === "Invalid token") {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
