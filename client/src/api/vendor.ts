import { RegisterVendor, Vendor } from '../types/vendor';
import { apiClient } from './api.config';

export const registerVendor = async (registerVendor: RegisterVendor) => {
  const { fullname, email, password } = registerVendor;

  await apiClient.post('/vendors/register', {
    fullname,
    email,
    password,
  });
};

type GetVendorResponse = {
  success: boolean;
  data: Vendor;
};

export const getVendor = async () => {
  const { data } = await apiClient.get<GetVendorResponse>('/vendors/');
  return data.data;
};

export const updateVendor = async () => {
  const { data } = await apiClient.get<GetVendorResponse>('/vendors/');
  return data.data;
};
