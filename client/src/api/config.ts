import axios from 'axios';

const apiConfig = {
  baseURL: 'http://localhost:3003/api/v1',
};

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
});
