import axios from "axios";
import { ElMessage } from "element-plus";
import { clearToken, getToken } from "./auth";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.chaogexiaochengxu.cn",
  timeout: 12000
});

service.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

service.interceptors.response.use(
  (response) => {
    const result = response.data || {};
    if (result.code === 0) {
      return result.data;
    }
    ElMessage.error(result.message || "请求失败");
    return Promise.reject(result);
  },
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      location.href = "/#/login";
    }
    ElMessage.error("网络异常，请稍后再试");
    return Promise.reject(error);
  }
);

export default service;
