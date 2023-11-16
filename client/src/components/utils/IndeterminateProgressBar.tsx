type ThisProps = {
  isVisible: boolean;
};

const IndeterminateProgressBar = ({ isVisible }: ThisProps) => {
  if (!isVisible) return;

  return (
    <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
      <div className='bg-blue-500 h-2 rounded-full animate-pulse'></div>
    </div>
  );
};

export default IndeterminateProgressBar;
