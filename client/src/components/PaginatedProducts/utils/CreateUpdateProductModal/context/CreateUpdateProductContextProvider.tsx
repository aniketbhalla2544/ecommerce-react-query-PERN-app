import React from 'react';

type CreateUpdateProductContextType = {
  name: string;
};

export const CreateUpdateProductContext =
  React.createContext<CreateUpdateProductContextType | null>(null);

const CreateUpdateProductContextProvider = ({
  children,
}: Record<'children', JSX.Element | JSX.Element[]>) => {
  return (
    <CreateUpdateProductContext.Provider value={null}>
      {children}
    </CreateUpdateProductContext.Provider>
  );
};

export default CreateUpdateProductContextProvider;
