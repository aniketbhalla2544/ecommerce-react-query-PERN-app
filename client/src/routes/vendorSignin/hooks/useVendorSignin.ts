import React from 'react';
import toast from 'react-hot-toast';
import { getZodValidationIssues } from '../../../utils/errorHandlingUtils';
import { logger } from '../../../utils/logger';
import { isProductionEnv } from '../../../utils/utils';
import { isAxiosError } from 'axios';
import { UknownObject } from '../../../types/general';
import { useNavigate } from 'react-router-dom';
import vendorSigninFormZodValidationSchema from '../vendorSigninFormZodValidationSchema';
import { signinVendor } from '../../../api/auth';

type FormStateFields = {
  email: string;
  password: string;
};

type FormState = FormStateFields & {
  signinStatus: 'idle' | 'loading' | 'success' | 'error';
  errors: null | Partial<FormStateFields> | UknownObject;
};

const initialFormState: FormState = {
  signinStatus: 'idle',
  email: '',
  password: '',
  errors: null,
};

const useVendorSignin = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = React.useState<FormState>(initialFormState);
  const { email, password, errors, signinStatus } = formState;
  const haveErrors = !!errors;
  const _errors = errors ?? {};
  const isEmailInputError = 'email' in _errors;
  const emailInputErrorMsg = _errors?.email || '';
  const isPasswordInputError = 'password' in _errors;
  const passwordInputErrorMsg = _errors?.password || '';
  const isSigninStatusLoading = signinStatus === 'loading';
  const allFormControlsDisabled = isSigninStatusLoading;
  const isFormSubmitBtnDisabled = allFormControlsDisabled;
  const isDefaultValuesBtnVisible = false && !isProductionEnv;
  const isVendorConflictError = 'isVendorConflictError' in _errors;

  const updateFormState = (newState: Partial<FormState>) => {
    setFormState((oldVal) => ({
      ...oldVal,
      ...newState,
    }));
  };

  const enterTestValues = () => {
    if (isProductionEnv) return;
    updateFormState({
      email: 'aniket@gmail.com',
      password: 'aniKet2023$$',
    });
  };

  const updateSigninStatus = (status: FormState['signinStatus']) => {
    updateFormState({
      signinStatus: status,
    });
  };

  const handleFormValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((oldVal) => ({
      ...oldVal,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      if (errors) {
        updateFormState({
          errors: null,
        });
      }
      const validatedFormValues = await vendorSigninFormZodValidationSchema.parseAsync(
        formState
      );
      return validatedFormValues;
    } catch (error) {
      toast.error('Unable to sign in 🫢');
      const issues = getZodValidationIssues(error);
      if (issues) {
        updateFormState({
          errors: issues,
        });
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedFormValues = await validateForm();
      if (!validatedFormValues) return;
      const { email, password } = validatedFormValues;
      updateSigninStatus('loading');
      await signinVendor({
        email,
        password,
      });
      updateSigninStatus('success');
      toast.success('Vendor loggedin successfully 🫣');
      navigate('/vendor/signin');
    } catch (error) {
      updateSigninStatus('error');
      toast.error('Unable to create account 🫢');
      logger.error(error);
      if (isAxiosError(error)) {
        const response = error?.response ?? {};
        if ('data' in response) {
          const responseData = response.data as UknownObject;
          logger.log({ responseData });
          if ('isVendorConflictError' in responseData) {
            logger.error('Vendor conflict error');
            updateFormState({
              errors: {
                ..._errors,
                isVendorConflictError: true,
              },
            });
          }
        }
      }
    }
  };

  React.useEffect(() => {
    logger.log(errors);
  });

  return {
    validationState: {
      haveErrors,
      isEmailInputError,
      emailInputErrorMsg,
      isPasswordInputError,
      passwordInputErrorMsg,
      isFormSubmitBtnDisabled,
      allFormControlsDisabled,
      isSigninStatusLoading,
      isVendorConflictError,
    },
    formState: {
      email,
      password,
      errors,
      enterTestValues,
    },
    isDefaultValuesBtnVisible,
    handleFormValues,
    handleFormSubmit,
  };
};

export default useVendorSignin;
