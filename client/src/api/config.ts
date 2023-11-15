import axios from 'axios';

const apiConfig = {
  baseURL: '/api/vendor/v1',
};

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
});
