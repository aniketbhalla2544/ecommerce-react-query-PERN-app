import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import RequiredInputSymbol from './RequiredInputSymbol';

type ThisProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  labelText: string;
  labelSufixText?: string;
  htmlFor: string;
  isInputError: boolean;
  errorMsg: string;
};

const Input = ({
  labelText,
  htmlFor,
  isInputError,
  errorMsg,
  labelSufixText = '',
  ...otherProps
}: ThisProps) => {
  const ringColorStyle = isInputError
    ? 'border-0 focus:border-0 ring-2 ring-red-500'
    : 'focus:ring-blue-500 focus:ring-offset-2';

  return (
    <div className='flex flex-col gap-y-3'>
      <label htmlFor={htmlFor}>
        {labelText.trim()}
        {otherProps.required && <RequiredInputSymbol />}
        <span className='text-xs text-gray-500'>{labelSufixText.trimEnd()}</span>
      </label>
      <input
        id={htmlFor}
        className={`rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2  ${ringColorStyle}`}
        {...otherProps}
      />
      {isInputError && errorMsg && <p className='text-red-500 text-xs'>{errorMsg}</p>}
    </div>
  );
};

export default Input;

// className={`rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColorStyle}`}
