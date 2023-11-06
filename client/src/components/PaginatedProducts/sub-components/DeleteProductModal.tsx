import Modal from '../../utils/Modal';
import { PiWarningLight } from 'react-icons/pi';
import Spinner from '../../utils/Spinner';

type ThisProps = {
  showModal: boolean;
  productId: number;
  showSpinner: boolean;
  onCancelBtnClick: () => void;
  onDeleteBtnClick: () => void;
};

const DeleteProductModal = ({
  showModal,
  productId,
  showSpinner,
  onCancelBtnClick,
  onDeleteBtnClick,
}: ThisProps) => {
  return (
    <Modal showModal={showModal}>
      <div className='rounded-lg bg-white opacity-100 overflow-hidden'>
        <div className='flex gap-x-4 px-16 pt-8 pb-6'>
          <div className='flex-center p-2 rounded-full w-10 h-10 bg-red-200 text-red-600 text-6xl font-bold'>
            <PiWarningLight />
          </div>
          <div>
            <p className='font-semibold mb-2'>Delete product with id = {productId}?</p>
            <p className='text-gray-500 max-w-[40ch] text-sm'>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
        </div>
        {/* ----- actions ---------- */}
        <div className='px-6 py-4 bg-gray-50'>
          <div className='flex justify-end items-center gap-x-4 text-sm'>
            <button
              disabled={showSpinner}
              onClick={onCancelBtnClick}
              className='font-semibold px-4 py-2 rounded-[6px] bg-white border-gray-200 border-2 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              disabled={showSpinner}
              onClick={onDeleteBtnClick}
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

export default DeleteProductModal;
