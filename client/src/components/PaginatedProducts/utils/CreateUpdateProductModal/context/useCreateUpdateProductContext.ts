import React from 'react';
import { CreateUpdateProductContext } from './CreateUpdateProductContextProvider';

export const useCreateUpdateProductContext = () => {
  const createUpdateProductContext = React.useContext(CreateUpdateProductContext);
  if (!createUpdateProductContext) {
    throw new Error(
      'Using CreateUpdateProductContext outside of CreateUpdateProductContext Provider'
    );
  }
  return createUpdateProductContext;
};
