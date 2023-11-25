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
import usePaginatedProducts from './hooks/usePaginatedProducts';
import UpperControlBoard from './sub-components/UpperControlBoard/UpperControlBoard';
import ConditionalRender from '../../../../utils/ConditionalRender';

const PRODUCT_NAME_MAX_LENGTH = 30;
const PRODUCT_DESCRIPTION_MAX_LENGTH = 40;
const rowLimits = [5, 10, 15, 25, 30];
const lowerRowLimit = Math.min(...rowLimits);

const PaginatedProducts = () => {
  const {
    limit,
    isPending,
    error,
    isError,
    queryResponseData,
    page,
    updateProductModalState,
    handleUpdateProductIconClick,
    onUpdateProductModalClose,
    deleteProductModalState,
    handleLimitChange,
    handlePageIncrement,
    handlePageDecrement,
    handleDeleteProductModalCancelBtnClick,
    handleDeleteProductTrashBtnIconClick,
    handleProductDeletion,
    updatePage,
  } = usePaginatedProducts();

  if (isPending) return <Spinner />;

  if (isError) {
    logger.error('Error while while fetching data: ', error?.message);
    return <h3 className='font-bold text-xl'>🔴 Error loading data.</h3>;
  }

  if (!queryResponseData || !queryResponseData.data) {
    return <h4>😶 No data found.</h4>;
  }

  const {
    data: products,
    meta: { totalProductPages },
  } = queryResponseData;

  const isPageIncrementBtnDisabled = page === totalProductPages || isPending;
  const isPageDecrementBtnDisabled = page === 1 || isPending;
  const isRowsPerPageSelectDisabled =
    totalProductPages === 1 && products.length < lowerRowLimit;

  return (
    <>
      <div className='bg-slate-100 px-8 py-10'>
        <UpperControlBoard updatePage={updatePage} />
        <div className='min-h-[400px] max-h-[600px] overflow-y-auto'>
          <table className='table-auto w-full max-w-full overflow-y-auto'>
            <thead>
              <tr className='border-0 border-b-[1px] border-gray-200'>
                <th scope='col' className='text-sm text-gray-600 px-4 py-3 text-left'>
                  Id
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Image
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Name
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Description
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Price
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Delete
                </th>
                <th scope='col' className='text-sm text-gray-600 py-3 text-left'>
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className='odd:bg-white even:bg-slate-50 [&>td]:py-3'>
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
                      className='hover:text-red-500 p-2'
                      onClick={() =>
                        handleDeleteProductTrashBtnIconClick(product.product_id)
                      }
                    >
                      <MdDelete />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateProductIconClick(product.product_id)}
                      className='hover:text-blue-500 p-2'
                    >
                      <BsPencilSquare />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*  ---------- control board ------------- */}
        <div className='mt-10'>
          <div className='flex items-center justify-end gap-x-20'>
            {/* ---------------- rows per page control */}
            <div className='flex items-center justify-center gap-x-4 flex-none text-sm'>
              <p className='text-gray-500'>Rows per page</p>
              {/* ----------- limit control --------------- */}
              <select
                disabled={isRowsPerPageSelectDisabled}
                value={limit}
                onChange={handleLimitChange}
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
            <div className='flex justify-center items-center w-fit gap-4 flex-none overflow-hidden'>
              {/* ----------- page extreme left control --------------- */}
              <button
                disabled={page === 1}
                onClick={() => updatePage(1)}
                className='bg-white flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
              >
                <FiChevronsLeft />
              </button>
              {/* ----------- page decrement control --------------- */}
              <button
                disabled={isPageDecrementBtnDisabled}
                onClick={handlePageDecrement}
                className='bg-white flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
              >
                <FiChevronLeft />
              </button>
              <p className='flex-none text-sm text-gray-500'>
                Page {page} of {totalProductPages}
              </p>
              {/* ----------- page increment control --------------- */}
              <button
                disabled={isPageIncrementBtnDisabled}
                onClick={handlePageIncrement}
                className='bg-white flex-none flex justify-center items-center p-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 hover:bg-slate-100 disabled:hover:bg-none border border-gray-200 rounded'
              >
                <FiChevronRight />
              </button>
              {/* ----------- page extreme right control --------------- */}
              <button
                disabled={page === totalProductPages}
                onClick={() => updatePage(totalProductPages)}
                className='bg-white flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-100 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-30  disabled:cursor-not-allowed'
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
        onCancelBtnClick={handleDeleteProductModalCancelBtnClick}
        onDeleteBtnClick={handleProductDeletion}
      />
      <UpdateProductModal
        productId={updateProductModalState.productId}
        showModal={updateProductModalState.showModal}
        onClose={onUpdateProductModalClose}
      />
    </>
  );
};

export default PaginatedProducts;
