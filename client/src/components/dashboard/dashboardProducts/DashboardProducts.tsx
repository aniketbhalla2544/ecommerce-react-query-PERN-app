// import PaginatedProducts from '../../PaginatedProducts/PaginatedProducts';

import PaginatedProducts from './sub-components/paginatedProducts/PaginatedProducts';

const DashboardProducts = () => {
  return (
    <div className='py-20 px-10'>
      <h1 className='text-2xl font-bold mb-4'>Products</h1>
      <PaginatedProducts />
    </div>
  );
};

export default DashboardProducts;
