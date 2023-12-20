import { updatedSettingsState } from '../components/dashboard/dashboardSettings/providers/vendorSettingsContextTypes';
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

export const updateVendor = async (fieldsChanged:updatedSettingsState)=>{
    const { email, fullname , isPremium , vendorId , vendorSlug:vendor_slug } = fieldsChanged;
    
    const res = await apiClient.post('/vendors/update' , { email, fullname , isPremium , vendorId , vendor_slug });
    return res.data
}

export type GetVendorResponse = {
  success: boolean;
  data: Vendor;
};

export const getVendor = async () => {
  const { data } = await apiClient.get<GetVendorResponse>('/vendors/');
  return data.data;
};

export const deleteVendor = async (vendorId:string) => {
  const data  = await apiClient.post('/vendors/delete' , {vendorId}); 
  return data.data;
};

