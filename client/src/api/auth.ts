import { SigninVendor } from '../types/vendor';
import { logger } from '../utils/logger';
import { apiClient } from './config';

export const signinVendor = async (registerVendor: SigninVendor) => {
  const { email, password } = registerVendor;
  const encodedCredentials = btoa(`${email}:${password}`);

  logger.log({
    email,
    password,
    encodedCredentials,
  });

  await apiClient.post('/auth/signin', null, {
    withCredentials: true,
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};
