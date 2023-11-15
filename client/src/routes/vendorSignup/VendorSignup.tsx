import { PiWarningLight } from 'react-icons/pi';
import Input from '../../components/utils/Input';
import useVendorSignup from './hooks/useVendorSignup';

const VendorSignup = () => {
  const {
    validationState: {
      haveErrors,
      isFullnameInputError,
      fullnameInputErrorMsg,
      isEmailInputError,
      emailInputErrorMsg,
      isPasswordInputError,
      passwordInputErrorMsg,
    },
    formState: { fullname, email, password, enterTestValues },
    isDefaultValuesBtnVisible,
    handleFormValues,
    handleFormSubmit,
    handleOnBlurEventOnFormInputFields,
  } = useVendorSignup();

  return (
    <div className='min-h-screen flex-center bg-gray-100'>
      <div className='min-w-[450px] max-w-[500px] bg-white shadow-md rounded-xl px-8 py-12'>
        <form onSubmit={handleFormSubmit}>
          <h2 className='text-lg font-semibold'>Create Account</h2>
          {haveErrors && (
            <div className='flex items-center gap-x-2 mt-6 text-red-500 bg-red-200 text-xs px-4 py-2 rounded-lg'>
              <p className='text-lg'>
                <PiWarningLight />
              </p>
              <p>Please enter the data in a valid format.</p>
            </div>
          )}
          {/* ----------- form controls */}
          <div className='flex flex-col gap-y-8 py-10'>
            <Input
              onChange={handleFormValues}
              value={fullname}
              type='text'
              htmlFor='fullname'
              spellCheck={false}
              name='fullname'
              labelText='Full Name'
              isInputError={isFullnameInputError}
              errorMsg={fullnameInputErrorMsg}
              placeholder='Enter full name ✏️'
              onBlur={handleOnBlurEventOnFormInputFields}
            />
            <Input
              onChange={handleFormValues}
              value={email}
              type='email'
              labelText='Email'
              name='email'
              htmlFor='email'
              isInputError={isEmailInputError}
              errorMsg={emailInputErrorMsg}
              placeholder='Enter email 📧'
              onBlur={handleOnBlurEventOnFormInputFields}
            />
            <div>
              <Input
                onChange={handleFormValues}
                value={password}
                labelText='Password'
                htmlFor='password'
                name='password'
                isInputError={isPasswordInputError}
                errorMsg={passwordInputErrorMsg}
                placeholder='your secret password 🫣'
                onBlur={handleOnBlurEventOnFormInputFields}
              />
              <ul className='flex flex-wrap text-gray-400 text-xs pt-4'>
                <div className='flex-auto [&>li]:pb-2'>
                  <li>8 character minimum</li>
                  <li>1 uppercase character</li>
                  <li>1 special character</li>
                </div>
                <div className='flex-auto [&>li]:pb-2'>
                  <li>1 lowercase letter</li>
                  <li>1 number</li>
                  <li>no spaces</li>
                </div>
              </ul>
            </div>
          </div>
          <button
            type='submit'
            className='disabled:opacity-60 disabled:cursor-not-allowed w-full font-semibold text-white bg-blue-500 hover:bg-blue-600 uppercase px-4 py-3  rounded-lg'
          >
            sign up
          </button>
          {/* ------------ for testing purposes only  */}
          {isDefaultValuesBtnVisible && (
            <button
              type='button'
              className='btn  border-2 mt-5'
              onClick={enterTestValues}
            >
              Default Values
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VendorSignup;
