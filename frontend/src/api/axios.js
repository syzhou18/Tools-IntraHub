// src/api/axios.js
import axios from 'axios';

// 建立一個 axios 實體
const api = axios.create({
  // 這裡會自動讀取 .env 裡的設定
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', 
  timeout: 10000, // 請求超過 10 秒自動中斷
});

// [選用] 請求攔截器：可以在這裡統一加 Token
api.interceptors.request.use(
  (config) => {
    // 假設你的 Token 存在 localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [選用] 回應攔截器：統一處理錯誤 (例如 401 token 過期)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 可以在這裡強制登出或導向登入頁
      console.error('登入逾時，請重新登入');
    }
    return Promise.reject(error);
  }
);

export default api;