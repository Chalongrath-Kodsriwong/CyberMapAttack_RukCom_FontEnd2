import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL, // ใช้ Base URL จาก .env
});

// Interceptor สำหรับ Response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ลบ Token ที่หมดอายุออกจาก LocalStorage
      localStorage.removeItem("jwt_token");

      // Redirect ไปยังหน้า Login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
