import React from 'react';
import { PaginatedProductsContext } from '../providers/PaginatedProductsProvider';
import { logger } from '../../../../../../utils/logger';

const usePaginatedProductsContext = () => {
  const paginatedProductsContext = React.useContext(PaginatedProductsContext);

  if (!paginatedProductsContext) {
    logger.error('paginatedProductsContext must be used inside of the provider.');
    throw new Error('app internal error');
  }

  return paginatedProductsContext;
};

export default usePaginatedProductsContext;
