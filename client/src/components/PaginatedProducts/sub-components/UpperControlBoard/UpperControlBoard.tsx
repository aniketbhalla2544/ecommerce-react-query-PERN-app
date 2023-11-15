import React from 'react';
import CreateProductModal from '../CreateProductModal';

type ThisProps = {
  updatePage: (newPage: number) => void;
};

const UpperControlBoard = ({ updatePage }: ThisProps) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleCloseCreateProductModal = () => {
    setShowModal(false);
  };

  const handleCreateProductBtnClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className='flex justify-end items-center mb-10'>
        <button
          onClick={handleCreateProductBtnClick}
          className='btn bg-blue-500 hover:bg-blue-600 text-white rounded-full'
        >
          Create
        </button>
      </div>
      <CreateProductModal
        showModal={showModal}
        onClose={handleCloseCreateProductModal}
        updatePage={updatePage}
      />
    </>
  );
};

export default UpperControlBoard;
