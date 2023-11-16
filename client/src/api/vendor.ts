import { RegisterVendor } from '../types/vendor';
import { apiClient } from './config';

export const registerVendor = async (registerVendor: RegisterVendor) => {
  const { fullname, email, password } = registerVendor;

  await apiClient.post('/vendors/register', {
    fullname,
    email,
    password,
  });
};
