import React from 'react';
import CreateProductModal from '../CreateProductModal';
import ConditionalRender from '../../../../../../utils/ConditionalRender';

type ThisProps = {
  selectedProductsCount: number;
  updatePage: (newPage: number) => void;
};

const UpperControlBoard = ({ selectedProductsCount, updatePage }: ThisProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const isProductSelectionEditState = !!selectedProductsCount;

  const handleCloseCreateProductModal = () => {
    setShowModal(false);
  };

  const handleCreateProductBtnClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className='mb-10'>
        <ConditionalRender
          truthyCondition={isProductSelectionEditState}
          falseCaseElement={
            <>
              <ProductSelectionCreateMode
                onCreateBtnClick={handleCreateProductBtnClick}
              />
              <CreateProductModal
                showModal={showModal}
                onClose={handleCloseCreateProductModal}
                updatePage={updatePage}
              />
            </>
          }
        >
          <ProductSelectionEditMode
            selectedProductsCount={selectedProductsCount}
            onDeleteBtnClick={() => {}}
          />
        </ConditionalRender>
      </div>
    </>
  );
};

export default UpperControlBoard;

// ------------------------------------------- ProductSelectionEditMode
type ProductSelectionEditModeProps = Pick<ThisProps, 'selectedProductsCount'> & {
  onDeleteBtnClick: () => void;
};

function ProductSelectionEditMode({
  selectedProductsCount,
  onDeleteBtnClick,
}: ProductSelectionEditModeProps) {
  const productText = selectedProductsCount > 1 ? 'products' : 'product';
  return (
    <div className='flex items-center'>
      <p className='text-sm text-gray-500'>
        {selectedProductsCount} {productText} selected
      </p>
      <button
        onClick={onDeleteBtnClick}
        className='w-fit ml-auto block btn bg-red-500 hover:bg-red-600 text-white rounded-full'
      >
        Delete
      </button>
    </div>
  );
}

type ProductSelectionCreateModeProps = {
  onCreateBtnClick: () => void;
};

function ProductSelectionCreateMode({
  onCreateBtnClick,
}: ProductSelectionCreateModeProps) {
  return (
    <div>
      <button
        onClick={onCreateBtnClick}
        className='w-fit ml-auto block btn bg-blue-500 hover:bg-blue-600 text-white rounded-full'
      >
        Create
      </button>
    </div>
  );
}
