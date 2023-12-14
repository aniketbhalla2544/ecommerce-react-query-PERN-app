import { FetchProductsQueryResponse } from '../../../../../../api/products';

// -------------------------------- productsState
export type ProductsState = {
  selectedProducts: number[];
};

type ProductsStateContextType = ProductsState & {
  selectedProductsCount: number;
  isProductSelectionEditState: boolean;
  updateProductsState: (state: Partial<ProductsState>) => void;
  handleProductSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// ------------------------------------------- deleteProductModalState
export type DeleteProductModalState = {
  showModal: boolean;
  showSpinner: boolean;
  productId: number;
};

type DeleteProductModalStateContextType = DeleteProductModalState & {
  handleDeleteProductModalCancelBtnClick: () => void;
  handleDeleteProductTrashBtnIconClick: (productId: number) => void;
  handleProductDeletion: () => void;
};

// ------------------------------------- updateProductModalState
export type UpdateProductModalState = {
  showModal: boolean;
  productId: number;
};

type UpdateProductModalStateContextType = UpdateProductModalState & {
  handleUpdateProductIconClick: (productId: number) => void;
  onUpdateProductModalClose: () => void;
};

// ------------------------------ paginationState
export type PaginationState = {
  page: number;
  limit: number;
};

type PaginateStateContextType = PaginationState & {
  handleLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageIncrement: () => void;
  handlePageDecrement: () => void;
  updatePage: (newPage: number) => void;
};

type ProductsQueryState = {
  queryResponseData: FetchProductsQueryResponse | undefined; // TODO: FIX TYPE
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

export type PaginatedProductsContextType = {
  paginationState: PaginateStateContextType;
  productsQueryState: ProductsQueryState;
  updateProductModalState: UpdateProductModalStateContextType;
  deleteProductModalState: DeleteProductModalStateContextType;
  productsState: ProductsStateContextType;
};
