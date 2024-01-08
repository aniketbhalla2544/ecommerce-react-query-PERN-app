import { isProductionEnv } from '@utils/utils';
import { Vendor } from 'types/vendor';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type DeleteModalState = {
  showModal: boolean;
  showSpinner: boolean;
  modalHeading: string;
  contentText: string;
};

export type State = {
  vendor: Vendor;
  accessToken: string;
  deleteModalState: DeleteModalState;
};

export type StateActions = {
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

export type AppState = State & StateActions;

const initialAppState: State = {
  accessToken: '',
  vendor: {
    id: '',
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
