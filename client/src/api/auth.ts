import { SigninVendor } from '../types/vendor';
import { apiClient } from './config';

// --- signinVendor
type SigninVendorResponse = {
  success: boolean;
  vendorId: string;
  vendorSlug: string;
  loginAccessToken: string;
};

export const signinVendor = async (registerVendor: SigninVendor) => {
  const { email, password } = registerVendor;
  const encodedCredentials = btoa(`${email}:${password}`);

  // withCredentials: true,
  const { data } = await apiClient.post<SigninVendorResponse>('/auth/signin', null, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
  return data;
};
