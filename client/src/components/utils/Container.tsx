const Container = ({ children }: Record<'children', React.ReactNode>) => {
  return (
    <div className='mx-auto px-3 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl'>
      {children}
    </div>
  );
};

export default Container;
// max-w-none md:max-w-md lg:max-w-5xl 2xl:max-w-screen-2xl
