import React from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, deleteProduct } from '../../../../../../api/products';
import { logger } from '../../../../../../utils/logger';

const usePaginatedProducts = () => {
  const [deleteProductModalState, setDeleteProductModalState] = React.useState({
    showModal: false,
    showSpinner: false,
    productId: 0,
  });
  const [updateProductModalState, setUpdateProductModalState] = React.useState({
    showModal: false,
    productId: 0,
  });
  const [paginationState, updatePaginationState] = React.useState({
    page: 1,
    limit: 5,
  });
  const { page, limit } = paginationState;
  const {
    data: queryResponseData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', { limit, page }],
    queryFn: () => fetchProducts(page, limit),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });
  const queryClient = useQueryClient();

  const updatePage = React.useCallback((newPage: number) => {
    updatePaginationState((oldVal) => ({
      ...oldVal,
      page: newPage,
    }));
  }, []);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    mutationKey: ['products'],
    retry: 3,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['products'], type: 'all' });
      queryClient.refetchQueries({ queryKey: ['products', { limit, page }] });
      const isPageGreaterThanTotalPages =
        page > (queryResponseData?.meta?.totalProductPages ?? 0);
      if (isPageGreaterThanTotalPages && queryResponseData) {
        updatePage(page - 1);
      }
    },
    onSettled: () => {},
    onError: () => {},
  });

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const newLimit = +e.target.value;
    updatePaginationState({
      page: 1,
      limit: newLimit,
    });
  };

  const handlePageIncrement = () => {
    updatePage(page + 1);
  };

  const handlePageDecrement = () => {
    updatePage(page - 1);
  };

  const validateProductId = () => {
    const toBeDeletedProductId = +deleteProductModalState.productId;
    const isInvalid = !toBeDeletedProductId;
    if (isInvalid) {
      toast.error('Unable to delete product.');
      logger.error(
        'Invalid product id while deleting product with id: ',
        toBeDeletedProductId
      );
      return false;
    }
    return true;
  };

  const handleDeleteProductModalCancelBtnClick = () => {
    setDeleteProductModalState({
      productId: 0,
      showModal: false,
      showSpinner: false,
    });
  };

  const handleDeleteProductTrashBtnIconClick = (productId: number) => {
    setDeleteProductModalState({
      showSpinner: false,
      productId: productId,
      showModal: true,
    });
  };

  const handleProductDeletion = async () => {
    const isValid = validateProductId();
    if (!isValid) return;
    const toBeDeletedProductId = deleteProductModalState.productId;
    try {
      setDeleteProductModalState((oldVal) => ({
        ...oldVal,
        showSpinner: true,
      }));
      await deleteMutation.mutateAsync(deleteProductModalState.productId);
      toast.success('Product successfully deleted');
      logger.log('trying to delete productId: ', toBeDeletedProductId);
    } catch (error) {
      toast.error('Unable to delete product.');
      logger.error('Error while deleting prodcut with id: ', toBeDeletedProductId);
    } finally {
      setDeleteProductModalState((oldVal) => ({
        ...oldVal,
        productId: 0,
        showModal: false,
        showSpinner: false,
      }));
    }
  };

  const handleUpdateProductIconClick = (productId: number) => {
    // ✅ productId validation
    if (!+productId) {
      toast.error('Unable to update product 😮');
      logger.error('Unable to update product because of invalid product id: ', productId);
      return;
    }
    setUpdateProductModalState({
      productId,
      showModal: true,
    });
  };

  const onUpdateProductModalClose = () => {
    setUpdateProductModalState({
      productId: 0,
      showModal: false,
    });
  };

  return {
    limit,
    isPending,
    isError,
    error,
    queryResponseData,
    page,
    deleteProductModalState,
    updatePage,
    handleLimitChange,
    handlePageIncrement,
    handlePageDecrement,
    updateProductModalState,
    handleUpdateProductIconClick,
    onUpdateProductModalClose,
    handleDeleteProductModalCancelBtnClick,
    handleDeleteProductTrashBtnIconClick,
    handleProductDeletion,
  };
};

export default usePaginatedProducts;
