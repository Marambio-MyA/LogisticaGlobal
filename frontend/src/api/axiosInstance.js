import axios from 'axios';

const host = import.meta.env.VITE_API_HOST;
const port = import.meta.env.VITE_API_PORT;
const env = import.meta.env.VITE_ENV;

const baseURL =
  env === 'production'
    ? `https://${host}/api`
    : `http://${host}:${port}/api`;

const axiosInstance = axios.create({ baseURL });

// Interceptor para añadir el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
