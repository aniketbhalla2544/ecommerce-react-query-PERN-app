import { SigninVendor } from '../types/vendor';
import { apiClient } from './api.config';

// --- signinVendor
type SigninVendorResponse = {
  success: boolean;
  loginAccessToken: string;
};

export const authRoutes = {
  SIGN_IN: '/auth/signin',
};

export const signinVendor = async (registerVendor: SigninVendor) => {
  const { email, password } = registerVendor;
  const { data } = await apiClient.post<SigninVendorResponse>(authRoutes.SIGN_IN, null, {
    auth: {
      username: email,
      password,
    },
  });
  return data;
};

export const signoutVendor = async () => {
  await apiClient.post('/auth/signout');
};
