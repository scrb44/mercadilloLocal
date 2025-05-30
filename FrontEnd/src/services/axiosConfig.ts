import axios from "axios";

// Crea una instancia de axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para añadir el token si existe
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
