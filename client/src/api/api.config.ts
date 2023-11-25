import axios, { AxiosError } from 'axios';
import useAppStore from '../stores/zustand/appStore';
import { logger } from '../utils/logger';
import { resetAppState } from '../utils/auth.utils';
import { isProductionEnv } from '../utils/utils';
import toast from 'react-hot-toast';

const apiConfig = {
  baseURL: '/api/vendor/v1',
};

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    logger.log(`${config.method} ${config.url}`);
    const accessToken = useAppStore.getState().accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    logger.log({
      interceptorError: error,
    });
    if (error instanceof AxiosError) {
      const status = error?.response?.status;
      // anauthorized access error
      if (status === 401) {
        !isProductionEnv && toast.error('Unauthorized access ✋🚫');
        resetAppState();
      }
    }
    return Promise.reject(error);
  }
);
