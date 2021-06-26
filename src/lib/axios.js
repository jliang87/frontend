import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const axiosConfig = {
  baseURL: 'http://localhost:3100/api/',
  timeout: 30000
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use((response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'));

export const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 0 });

export default axiosInstance;
