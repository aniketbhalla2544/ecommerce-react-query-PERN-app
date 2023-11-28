import { create } from 'zustand';
import { Vendor } from '../../types/vendor';
import { devtools, persist } from 'zustand/middleware';
import { isProductionEnv } from '../../utils/utils';

type DeleteModalState = {
  showModal: boolean;
  showSpinner: boolean;
  modalHeading: string;
  contentText: string;
};

type State = {
  vendor: Vendor;
  accessToken: string;
  deleteModalState: DeleteModalState;
};

type StateActions = {
  setVendor: (vendor: Vendor) => void;
  setAccessToken: (token: string) => void;
  resetAppState: VoidFunction;
  resetDeleteModalState: VoidFunction;
  onDeleteModalCancelBtnClick?: VoidFunction;
  onDeleteModalDeleteBtnClick?: VoidFunction;
  setDeleteModalState: (
    state: DeleteModalState,
    onCancelBtnClick: VoidFunction,
    onDeleteBtnClick: VoidFunction
  ) => void;
  updateDeleteModalState: (state: Partial<DeleteModalState>) => void;
};

type AppState = State & StateActions;

const initialAppState: State = {
  accessToken: '',
  vendor: {
    vendorId: '',
    email: '',
    vendorSlug: '',
    fullname: '',
    isPremium: false,
  },
  deleteModalState: {
    showModal: false,
    showSpinner: false,
    contentText: '',
    modalHeading: '',
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
        resetDeleteModalState: () =>
          set(() => ({ deleteModalState: initialAppState.deleteModalState })),
        setDeleteModalState: (state, onCancelBtnClick, onDeleteBtnClick) =>
          set(() => ({
            deleteModalState: state,
            onDeleteModalCancelBtnClick: onCancelBtnClick,
            onDeleteModalDeleteBtnClick: onDeleteBtnClick,
          })),
        updateDeleteModalState: (updatedState) =>
          set((state) => ({
            deleteModalState: { ...state.deleteModalState, ...updatedState },
          })),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          accessToken: state.accessToken,
          vendor: state.vendor,
        }),
      }
    ),
    {
      enabled: !isProductionEnv,
    }
  )
);

export default useAppStore;
