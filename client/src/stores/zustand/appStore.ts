import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';,
import { Vendor } from '../../types/vendor';
import { devtools, persist } from 'zustand/middleware';

type AppState = {
  accessToken: string;
  vendor: Vendor;
  setVendor: (vendor: Vendor) => void;
  setAccessToken: (token: string) => void;
  resetAppState: () => void;
};

const initialAppState = {
  accessToken: '',
  vendor: {
    vendorId: '',
    email: '',
    vendorSlug: '',
    fullname: '',
    isPremium: false,
  },
};

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialAppState,
        setAccessToken: (token) => set(() => ({ accessToken: token })),
        setVendor: (vendor: Vendor) => set(() => ({ vendor })),
        resetAppState: () => set(() => initialAppState),
      }),
      {
        name: 'app-store',
      }
    ),
    {
      enabled: true,
    }
  )
);

export default useAppStore;
