import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 3000,
});

// Optional: thêm interceptor request
axiosClient.interceptors.request.use(
  (config) => {
    // Có thể thêm token auth vào header
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: interceptor response để xử lý lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      // Nếu token hết hạn hoặc không hợp lệ, chuyển hướng đến trang đăng nhập
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
