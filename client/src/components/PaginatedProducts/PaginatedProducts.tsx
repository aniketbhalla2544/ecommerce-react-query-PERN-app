import Spinner from '../utils/Spinner';
import { priceFormatter } from '../../utils/utils';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import DeleteProductModal from './sub-components/DeleteProductModal';
import usePaginatedProducts from './hooks/usePaginatedProducts';
import UpperControlBoard from './sub-components/UpperControlBoard/UpperControlBoard';

const PaginatedProducts = () => {
  const {
    limit,
    isPending,
    isError,
    queryResponseData,
    page,
    deleteProductModalState,
    handleLimitChange,
    handlePageIncrement,
    handlePageDecrement,
    handleDeleteProductModalCancelBtnClick,
    handleDeleteProductTrashBtnIconClick,
    handleProductDeletion,
    updatePage,
  } = usePaginatedProducts();

  if (isPending || !queryResponseData) return <Spinner />;

  if (isError) return <h3 className='font-bold text-xl'>🔴 Error</h3>;

  const {
    data: products,
    meta: { totalProductPages },
  } = queryResponseData;

  const isPageIncrementBtnDisabled = page === totalProductPages || isPending;
  const isPageDecrementBtnDisabled = page === 1 || isPending;

  return (
    <>
      <div>
        <UpperControlBoard updatePage={updatePage} />
        <ul className='h-[324px] overflow-auto'>
          {products.map((product) => (
            <li
              className='hover:rounded flex gap-x-4 justify-between items-center border-b-[1px] border-gray-400  px-5 py-4 hover:bg-gray-50 cursor-pointer'
              key={product.product_id}
            >
              <p className='flex-none bg-gray-200 rounded px-2 py-1'>
                {product.product_id}
              </p>
              <div className='flex flex-auto gap-x-5'>
                <p className='flex-auto px-4 line-clamp-1 max-w-fit'>{product.title}</p>
                <p className='flex-none max-w-[40ch] line-clamp-1 text-gray-500 text-sm'>
                  {product.description}
                </p>
              </div>
              <p className='flex-none px-2 text-sm text-green-600'>
                {priceFormatter(product.price)}
              </p>
              <button
                className='flex-none hover:text-red-500 p-2'
                onClick={() => handleDeleteProductTrashBtnIconClick(product.product_id)}
              >
                <MdDelete />
              </button>
              <button onClick={() => {}} className='flex-none hover:text-blue-500 p-2'>
                <BsPencilSquare />
              </button>
            </li>
          ))}
        </ul>
        {/*  ---------- control board ------------- */}
        <div className='my-10'>
          <div className='flex items-center justify-end gap-x-20'>
            {/* ---------------- rows per page control */}
            <div className='flex items-center justify-center gap-x-4 flex-none text-sm'>
              <p className='text-gray-500'>Rows per page</p>
              {/* ----------- limit control --------------- */}
              <select
                defaultValue='15'
                value={limit}
                onChange={handleLimitChange}
                required
                name='page'
                id='page'
                className='w-14 text-center flex-none bg-white px-1 py-1 cursor-pointer appearance-none invalid:text-black/30 border border-gray-200 rounded'
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='15'>15</option>
                <option value='25'>25</option>
                <option value='30'>30</option>
              </select>
            </div>
            {/* ----------- page increment/decrement control --------------- */}
            <div className='flex justify-center items-center w-fit gap-4 flex-none overflow-hidden'>
              {/* ----------- page extreme left control --------------- */}
              <button
                disabled={page === 1}
                onClick={() => updatePage(1)}
                className='flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-50 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-50  disabled:cursor-not-allowed'
              >
                <FiChevronsLeft />
              </button>
              {/* ----------- page decrement control --------------- */}
              <button
                disabled={isPageDecrementBtnDisabled}
                onClick={handlePageDecrement}
                className='flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-50 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-50  disabled:cursor-not-allowed'
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
                className='flex-none flex justify-center items-center p-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-none border border-gray-200 rounded'
              >
                <FiChevronRight />
              </button>
              {/* ----------- page extreme right control --------------- */}
              <button
                disabled={page === totalProductPages}
                onClick={() => updatePage(totalProductPages)}
                className='flex-none flex justify-center items-center p-2 border cursor-pointer hover:bg-slate-50 disabled:hover:bg-none border-gray-200 rounded disabled:opacity-50  disabled:cursor-not-allowed'
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
    </>
  );
};

export default PaginatedProducts;
