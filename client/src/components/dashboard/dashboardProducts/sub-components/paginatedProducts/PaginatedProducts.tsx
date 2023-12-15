import { logger } from '../../../../../utils/logger';
import { priceFormatter } from '../../../../../utils/utils';
import Spinner from '../../../../utils/Spinner';
import { MdDelete } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import DeleteProductModal from './sub-components/DeleteProductModal';
import UpdateProductModal from './sub-components/UpdateProductModal';
import UpperControlBoard from './sub-components/UpperControlBoard/UpperControlBoard';
import ConditionalRender from '../../../../utils/ConditionalRender';
import TableColumns from './sub-components/TableColumns';
import PaginatedProductsProvider from './providers/PaginatedProductsProvider';
import usePaginatedProductsContext from './hooks/usePaginatedProductsContext';

const PRODUCT_NAME_MAX_LENGTH = 30;
const PRODUCT_DESCRIPTION_MAX_LENGTH = 40;
const rowLimits = [5, 10, 15, 25, 30];
const lowerRowLimit = Math.min(...rowLimits);

const PaginatedProducts = () => {
  return (
    <PaginatedProductsProvider>
      <PaginatedProductsWithContext />
    </PaginatedProductsProvider>
  );
};

export default PaginatedProducts;

function PaginatedProductsWithContext() {
  const {
    paginationState,
    productsQueryState,
    updateProductModalState,
    deleteProductModalState,
    productsState,
  } = usePaginatedProductsContext();

  if (productsQueryState.isPending) return <Spinner />;

  if (productsQueryState.isError) {
    logger.error('Error while while fetching data: ', productsQueryState.error?.message);
    return <h3 className='font-bold text-xl'>🔴 Error loading data.</h3>;
  }

  if (
    !productsQueryState.queryResponseData ||
    !productsQueryState.queryResponseData.data
  ) {
    return <h4>😶 No data found.</h4>;
  }

  const {
    data: products,
    meta: { totalProductPages },
  } = productsQueryState.queryResponseData;

  const isPageIncrementBtnDisabled =
    paginationState.page === totalProductPages || productsQueryState.isPending;
  const isPageDecrementBtnDisabled =
    paginationState.page === 1 || productsQueryState.isPending;
  const isRowsPerPageSelectDisabled =
    totalProductPages === 1 && products.length < lowerRowLimit;

  return (
    <>
      <div className='bg-slate-100 px-8 py-10'>
        <UpperControlBoard />
        <div className='min-h-[300px] max-h-[400px] overflow-y-auto'>
          <table className='table-auto w-full max-w-full overflow-y-auto'>
            <TableColumns />
            <tbody>
              {products.map((product, index) => {
                const isProductSelected = productsState.selectedProducts.includes(
                  product.product_id
                );
                const uniqueItemKey = `${index}-${isProductSelected}`;
                return (
                  <tr
                    key={uniqueItemKey}
                    className={`${isProductSelected
                      ? 'bg-blue-100'
                      : 'hover:bg-blue-100 odd:bg-white even:bg-slate-50'
                      } [&>td]:py-3 hover:cursor-pointer `}
                  >
                    <td className='text-center'>
                      <input
                        onChange={productsState.handleProductSelection}
                        type='checkbox'
                        checked={isProductSelected}
                        name='product-selection'
                        value={product.product_id as number}
                        id={String(product.product_id)}
                        className='hover:cursor-pointer w-[15px] h-[15px] align-middle'
                      />
                    </td>
                    <td className='px-4 text-gray-500'>{product.product_id}</td>
                    <td>
                      <div className='w-4 h-4'>
                        <img
                          src={product.image ?? ''}
                          alt='vendor-profile-img'
                          className='w-full h-full object-cover rounded-full'
                        />
                      </div>
                    </td>
                    <td>
                      <p className='text-gray-500 whitespace-nowrap'>
                        <ConditionalRender
                          truthyCondition={product.title.length > PRODUCT_NAME_MAX_LENGTH}
                          falseCaseElement={product.title}
                        >
                          {product.title.substring(0, PRODUCT_NAME_MAX_LENGTH - 1)}
                          ...
                        </ConditionalRender>
                      </p>
                    </td>
                    <td>
                      <p className='text-gray-500 whitespace-nowrap'>
                        <ConditionalRender
                          truthyCondition={
                            product.description.length > PRODUCT_DESCRIPTION_MAX_LENGTH
                          }
                          falseCaseElement={product.description}
                        >
                          {product.description.substring(
                            0,
                            PRODUCT_DESCRIPTION_MAX_LENGTH - 1
                          )}
                          ...
                        </ConditionalRender>
                      </p>
                    </td>
                    <td className='text-gray-500 text-sm'>
                      {priceFormatter(product.price)}
                    </td>
                    <td>
                      <button
                        disabled={productsState.isProductSelectionEditState}
                        className={`p-2 ${productsState.isProductSelectionEditState
                          ? 'disabled-state'
                          : 'hover:text-red-500'
                          }`}
                        onClick={() =>
                          deleteProductModalState.handleDeleteProductTrashBtnIconClick(
                            product.product_id
                          )
                        }
                      >
                        <MdDelete />
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={productsState.isProductSelectionEditState}
                        onClick={() =>
                          updateProductModalState.handleUpdateProductIconClick(
                            product.product_id
                          )
                        }
                        className={`p-2 ${productsState.isProductSelectionEditState
                          ? 'disabled-state'
                          : 'hover:text-blue-500'
                          }`}
                      >
                        <BsPencilSquare />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/*  ---------- control board ------------- */}
        <div className='mt-10'>
          <div className='flex items-center justify-end gap-x-20'>
            {/* ---------------- rows per page control */}
            <div className='flex items-center justify-center gap-x-4 flex-none text-sm bg-white px-4 py-2 rounded-lg shadow-sm'>
              <p className='text-gray-500'>Rows per page</p>
              {/* ----------- limit control --------------- */}
              <select
                disabled={isRowsPerPageSelectDisabled}
                value={paginationState.limit}
                onChange={paginationState.handleLimitChange}
                required
                name='page'
                id='page'
                className='w-14 text-center flex-none bg-white px-1 py-1 cursor-pointer appearance-none invalid:text-black/30 border border-gray-200 rounded disabled:cursor-not-allowed disabled:opacity-30'
              >
                {rowLimits.map((limit, index) => (
                  <option key={index} value={String(limit)}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>
            {/* ----------- page increment/decrement control --------------- */}
            <div className='flex justify-center items-center w-fit gap-4 flex-none overflow-hidden bg-white px-4 py-2 rounded-lg shadow-sm'>
              {/* ----------- page extreme left control --------------- */}
              <button
                disabled={paginationState.page === 1}
                onClick={() => paginationState.updatePage(1)}
                className='bg-white flex-none flex justify-center items-center p-2 cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
              >
                <FiChevronsLeft />
              </button>
              {/* ----------- page decrement control --------------- */}
              <button
                disabled={isPageDecrementBtnDisabled}
                onClick={paginationState.handlePageDecrement}
                className='bg-white flex-none flex justify-center items-center p-2 cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
              >
                <FiChevronLeft />
              </button>
              <p className='flex-none text-sm text-gray-500'>
                Page {paginationState.page} of {totalProductPages}
              </p>
              {/* ----------- page increment control --------------- */}
              <button
                disabled={isPageIncrementBtnDisabled}
                onClick={paginationState.handlePageIncrement}
                className='bg-white flex-none flex justify-center items-center p-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded'
              >
                <FiChevronRight />
              </button>
              {/* ----------- page extreme right control --------------- */}
              <button
                disabled={paginationState.page === totalProductPages}
                onClick={() => paginationState.updatePage(totalProductPages)}
                className='bg-white flex-none flex justify-center items-center p-2 cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
              >
                <FiChevronsRight />
              </button>
            </div>
            {/* ----------- page increment/decrement control --------------- */}
          </div>
        </div>
      </div>
      <DeleteProductModal
        showSpinner={deleteProductModalState.showSpinner}
        productId={deleteProductModalState.productId}
        showModal={deleteProductModalState.showModal}
        onCancelBtnClick={deleteProductModalState.handleDeleteProductModalCancelBtnClick}
        onDeleteBtnClick={deleteProductModalState.handleProductDeletion}
      />
      <UpdateProductModal
        productId={updateProductModalState.productId}
        showModal={updateProductModalState.showModal}
        onClose={updateProductModalState.onUpdateProductModalClose}
      />
    </>
  );
}
