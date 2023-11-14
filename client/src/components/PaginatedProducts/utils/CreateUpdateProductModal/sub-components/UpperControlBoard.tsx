import { FiX } from 'react-icons/fi';
import { useCreateUpdateProductContext } from '../context/useCreateUpdateProductContext';

const UpperControlBoard = () => {
  const { handleCloseModal } = useCreateUpdateProductContext();

  return (
    <div className='flex justify-end items-center px-6 py-5 mb-2 border-b-2 border-gray-100'>
      {/* --------- close btn ---------- */}
      <button
        onClick={handleCloseModal}
        className='text-xs flex-center p-2 text-black hover:bg-gray-300 bg-gray-200 rounded-full cursor-pointer'
      >
        <FiX />
      </button>
    </div>
  );
};

export default UpperControlBoard;
