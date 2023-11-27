import React from 'react';

type PaginatedProductsContextType = {
  name: string;
}

export const PaginatedProductsContext =React.createContext<PaginatedProductsContextType | null>(null);

const PaginatedProductsProvider = () => {
  return (
    <div>PaginatedProductsProvider</div>
  )
}

export default PaginatedProductsProvider