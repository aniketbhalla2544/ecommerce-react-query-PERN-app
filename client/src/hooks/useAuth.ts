import useAppStore from '../stores/zustand/zustand.store';

const useAuth = () => {
  const accessToken = useAppStore((state) => state.accessToken);

  return {
    isVendorLoggedIn: !!accessToken,
  };
};

export default useAuth;
