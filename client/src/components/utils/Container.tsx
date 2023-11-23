const Container = ({ children }: Record<'children', React.ReactNode>) => {
  return (
    <div className='mx-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl'>
      {children}
    </div>
  );
};

export default Container;
// className='mx-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl'
