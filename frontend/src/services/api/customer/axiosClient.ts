import axios from "axios";

const BASE_URL = "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào mọi request nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi phản hồi
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Nếu lỗi 401 (Unauthorized), có thể logout user tại đây
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // window.location.href = "/customer/login"; // Tùy chọn redirect
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
