import { PiWarningLight } from 'react-icons/pi';
import Modal from '../Modal';
import Spinner from '../Spinner';
import useAppStore from '../../../stores/zustand/appStore';

const DeleteModal = () => {
  const { deleteModalState, onDeleteModalCancelBtnClick, onDeleteModalDeleteBtnClick } =
    useAppStore((state) => ({
      deleteModalState: state.deleteModalState,
      onDeleteModalCancelBtnClick: state.onDeleteModalCancelBtnClick,
      onDeleteModalDeleteBtnClick: state.onDeleteModalDeleteBtnClick,
    }));
  const { showModal, showSpinner, modalHeading, contentText } = deleteModalState;

  return (
    <Modal showModal={showModal}>
      <div className='rounded-lg bg-white opacity-100 overflow-hidden'>
        <div className='flex gap-x-4 px-16 pt-8 pb-6'>
          <div className='flex-center p-2 rounded-full w-10 h-10 bg-red-200 text-red-600 text-6xl font-bold'>
            <PiWarningLight />
          </div>
          <div>
            <h3 className='font-semibold mb-2'>{modalHeading}</h3>
            <p className='text-gray-500 max-w-[40ch] text-sm'>{contentText}</p>
          </div>
        </div>
        {/* ----- actions ---------- */}
        <div className='px-6 py-4 bg-gray-50'>
          <div className='flex justify-end items-center gap-x-4 text-sm'>
            <button
              disabled={showSpinner}
              onClick={onDeleteModalCancelBtnClick}
              className='font-semibold px-4 py-2 rounded-[6px] bg-white border-gray-200 border-2 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              disabled={showSpinner}
              onClick={onDeleteModalDeleteBtnClick}
              className='flex gap-x-3 font-semibold px-4 py-2 rounded-[6px] bg-red-600 text-white hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Delete
              {!!showSpinner && <Spinner textColor='text-white' />}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
