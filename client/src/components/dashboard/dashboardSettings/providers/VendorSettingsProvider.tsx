import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import useAppStore from '../../../../stores/zustand/appStore';
import { useForm } from 'react-hook-form';
import { Vendor } from '../../../../types/vendor';
import { AxiosError } from 'axios';
import { resetAppState } from '../../../../utils/auth.utils';

import { updatedSettingsState, vendorSettingsStateContextType } from './vendorSettingsContextTypes';
import { deleteVendor, updateVendor } from '../../../../api/vendor';

export const VendorSettingsContext = React.createContext<vendorSettingsStateContextType | null>(
  null
);
// provider for vendros setting page
const VendorSettingsProvider = ({ children }: Record<'children', React.ReactNode>) => {
  // load vendor profile data from AppStore
  const { vendor: vendorData } = useAppStore.getState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<updatedSettingsState>();

  // to check the errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      if (errors.email) {
        if (errors.email.type) {
          setError('email', { type: 'custom', message: 'please enter correct email' });
        }
      }
    }
  }, [errors]);
  // to update the profile data in DB
  const onSubmit = async (data: updatedSettingsState) => {
    try {
      const res = await updateVendor(data);
      console.log({ res });
      if (res.success) {
        toast('Settings updated ! ✅');
        useAppStore.setState({ vendor: data as Vendor });
      }
    } catch (e) {
      let error = '';
      console.log({ e });
      if (e instanceof AxiosError) {
        error = e.response?.data?.message;
        if (error.includes('slug already exists')) {
          setError('vendorSlug', { type: 'custom', message: 'Vendor slug is not available' });
        }
        if (error.includes('email already exists.')) {
          setError('email', { type: 'custom', message: 'Vendor email already exists.' });
        }
      }

      toast('Something went wrong ! ❌ ' + error);
      // need to check all the errors
    }

    // else { toast("Something went wrong ! ❌") }
    // // to remove save button
    // setIsChanged(false)
  };
  const handleDelete = async () => {
    const { id } = vendorData;
    const data = await deleteVendor(id);
    if (!!data && data.success) {
      toast('account deletion Success ✅');
      resetAppState();
    }
  };

  //
  return (
    <VendorSettingsContext.Provider
      value={{
        vendorSettingsQueryState: {
          queryResponseData: vendorData,
          handleSubmit,
          handleDelete,
          register,
          onSubmit,
          errors,
        },
      }}
    >
      {children}
    </VendorSettingsContext.Provider>
  );
};

export default VendorSettingsProvider;
