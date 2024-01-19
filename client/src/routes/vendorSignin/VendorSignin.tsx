import { PiWarningLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import useVendorSignin from './hooks/useVendorSignin';
import IndeterminateProgressBar from '../../components/utils/IndeterminateProgressBar';
import Input from '../../components/utils/Input';
import Spinner from '../../components/utils/Spinner';
import appRoutes from '@constants/app.routes';

// TODO: add show password icon to password input

const VendorSignin = () => {
  const {
    validationStates: {
      isEmailInputError,
      emailInputErrorMsg,
      isPasswordInputError,
      passwordInputErrorMsg,
      isFormSubmitBtnDisabled,
      allFormControlsDisabled,
      isSigninStatusLoading,
      invalidCredentialsError,
    },
    formState,
    enterTestValues,
    isDefaultValuesBtnVisible,
    handleFormValues,
    handleFormSubmit,
  } = useVendorSignin();

  return (
    <div className='min-h-screen flex-center bg-gray-100 py-12'>
      <div className='min-w-[450px] max-w-[500px] bg-white shadow-md rounded-xl overflow-hidden'>
        <IndeterminateProgressBar isVisible={isSigninStatusLoading} />
        <div className='px-8 py-12'>
          <form onSubmit={handleFormSubmit}>
            <h2 className='text-lg font-semibold'>Vendor Sign In</h2>
            <ul>
              <FormErrorMsg isVisible={invalidCredentialsError}>
                <p>Incorrect email or password.</p>
              </FormErrorMsg>
            </ul>
            {/* ----------- form controls */}
            <div className='flex flex-col gap-y-8 py-10'>
              <Input
                autoFocus
                type='email'
                disabled={allFormControlsDisabled}
                onChange={handleFormValues}
                value={formState.email}
                labelText='Email'
                name='email'
                htmlFor='email'
                isInputError={isEmailInputError}
                errorMsg={emailInputErrorMsg}
                placeholder='username@example.com'
              />
              <div>
                <Input
                  type='password'
                  disabled={allFormControlsDisabled}
                  onChange={handleFormValues}
                  value={formState.password}
                  labelText='Password'
                  htmlFor='password'
                  name='password'
                  isInputError={isPasswordInputError}
                  errorMsg={passwordInputErrorMsg}
                />
              </div>
            </div>
            {/* ----------------- form actions */}
            <div>
              <button
                disabled={isFormSubmitBtnDisabled}
                type='submit'
                className='flex items-center justify-center gap-x-3 disabled:opacity-60 disabled:cursor-not-allowed w-full font-semibold text-white bg-blue-500 hover:bg-blue-600 uppercase px-4 py-3  rounded-lg'
              >
                Sign in {isSigninStatusLoading && <Spinner />}
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
            </div>
          </form>
          <p className='text-center text-sm mt-4'>
            <span>Don't have an account?</span>&nbsp;
            <Link to={appRoutes.REGISTER} className='app-link'>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorSignin;

// -------- FormErrorMsg

type FormErrorMsgProps = {
  children: JSX.Element;
  isVisible: boolean;
};

const FormErrorMsg = ({ isVisible, children }: FormErrorMsgProps) => {
  if (!isVisible) return <></>;
  return (
    <div
      className='flex items-center gap-x-2 mt-6 text-red-500 bg-red-200 text-xs px-4 py-2 rounded-lg'
      role='alert'
    >
      <p className='text-lg'>
        <PiWarningLight />
      </p>
      {children}
    </div>
  );
};
