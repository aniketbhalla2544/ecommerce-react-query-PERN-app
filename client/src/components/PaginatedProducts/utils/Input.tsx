import RequiredInputSymbol from '../../utils/RequiredInputSymbol';

type ThisProps = {
  labelText: string;
  htmlFor: string;
  isInputError: boolean;
  errorMsg: string;
  [key: string]: unknown;
};

const Input = ({
  labelText,
  htmlFor,
  isInputError,
  errorMsg,
  ...otherProps
}: ThisProps) => {
  const ringColorStyle = isInputError
    ? 'ring-red-500 focus:ring-red-500'
    : 'focus:ring-blue-500';

  return (
    <div className='flex flex-col gap-y-3'>
      <label htmlFor={htmlFor}>
        {labelText}
        <RequiredInputSymbol />
      </label>
      <input
        className={`rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColorStyle}`}
        {...otherProps}
      />
      {isInputError && errorMsg && <p className='text-red-500 text-xs'>{errorMsg}</p>}
    </div>
  );
};

export default Input;
