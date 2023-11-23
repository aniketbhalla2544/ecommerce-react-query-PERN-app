import useAppStore from '../stores/zustand/appStore';

const useAuth = () => {
  const accessToken = useAppStore((state) => state.accessToken);

  return {
    isVendorLoggedIn: !!accessToken,
  };
};

export default useAuth;
