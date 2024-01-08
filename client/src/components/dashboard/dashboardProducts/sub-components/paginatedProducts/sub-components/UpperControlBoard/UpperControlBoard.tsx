import React from 'react';
import CreateProductModal from '../CreateProductModal';
import ConditionalRender from '../../../../../../utils/ConditionalRender';
import usePaginatedProductsContext from '../../hooks/usePaginatedProductsContext';
import useAppStore from '../../../../../../../stores/zustand/zustand.store';
import toast from 'react-hot-toast';
import { logger } from '../../../../../../../utils/logger';
import { deleteProduct } from '../../../../../../../api/products';
import { IoMdRefresh } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const notificationPosition = {
  position: 'bottom-right' as const,
};

const UpperControlBoard = () => {
  const queryClient = useQueryClient();
  const { setDeleteModalState, resetDeleteModalState, updateDeleteModalState } =
    useAppStore((state) => ({
      setDeleteModalState: state.setDeleteModalState,
      resetDeleteModalState: state.resetDeleteModalState,
      updateDeleteModalState: state.updateDeleteModalState,
    }));

  const deleteProductsMutation = useMutation({
    mutationFn: deleteProduct,
    mutationKey: ['products'],
    retry: 3,
  });

  const { productsState, paginationState } = usePaginatedProductsContext();
  const selectedProductsCount = productsState.selectedProductsCount;

  const [showModal, setShowModal] = React.useState(false);
  const isProductSelectionEditState = productsState.isProductSelectionEditState;

  const handleCloseCreateProductModal = () => setShowModal(false);
  const handleCreateProductBtnClick = () => setShowModal(true);

  const handleDeleteProductsBtnClick = () => {
    // deleting products
    setDeleteModalState(
      {
        modalHeading: 'Sure about deleting products?',
        contentText: `Upon deleting, the action can't be undone.`,
        showModal: true,
        showSpinner: false,
      },
      () => resetDeleteModalState(), // cancel btn
      () => {
        // delete btn
        (async () => {
          try {
            console.log(
              'productsState.selectedProducts id: ',
              productsState.selectedProducts
            );
            updateDeleteModalState({
              showSpinner: true,
            });
            const toBeDeletedProductIds = productsState.selectedProducts;
            for (const productId of toBeDeletedProductIds) {
              const loaderId = toast.loading(
                `Deleting product ${productId}`,
                notificationPosition
              );
              await deleteProductsMutation.mutateAsync(productId);
              toast.dismiss(loaderId);
              toast.success(`Product ${productId} deleted 😄`, notificationPosition);
            }
            // ✅ all products successfully deleted till here
            productsState.updateProductsState({
              selectedProducts: [],
            });
            resetDeleteModalState();
          } catch (error) {
            toast.dismiss();
            toast.error('Error deleting products 🤕', notificationPosition);
            logger.error('deleting product error: ', error);
          } finally {
            queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
            updateDeleteModalState({
              showSpinner: false,
            });
          }
        })();
      }
    );
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
                updatePage={paginationState.updatePage}
              />
            </>
          }
        >
          <ProductSelectionEditMode
            selectedProductsCount={selectedProductsCount}
            onDeleteBtnClick={handleDeleteProductsBtnClick}
          />
        </ConditionalRender>
      </div>
    </>
  );
};

export default UpperControlBoard;

// ------------------------------------------- ProductSelectionEditMode
type ProductSelectionEditModeProps = {
  selectedProductsCount: number;
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
  const queryClient = useQueryClient();

  const handleDashboardRefreshProductsBtnClick = () => {
    queryClient.invalidateQueries({
      queryKey: ['products'],
      exact: false,
    });
  };

  return (
    <div className='flex justify-end items-center gap-x-6'>
      <button
        onClick={handleDashboardRefreshProductsBtnClick}
        className='flex-none w-fit text-xl hover:bg-slate-200 rounded-full p-2'
      >
        <IoMdRefresh />
      </button>
      <button
        onClick={onCreateBtnClick}
        className='flex-none w-fit btn bg-blue-500 hover:bg-blue-600 text-white rounded-full'
      >
        Create
      </button>
    </div>
  );
}
