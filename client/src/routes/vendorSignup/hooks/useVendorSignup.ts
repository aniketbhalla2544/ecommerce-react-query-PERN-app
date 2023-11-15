import React from 'react';
import toast from 'react-hot-toast';
import { getZodValidationIssues } from '../../../utils/errorHandlingUtils';
import { logger } from '../../../utils/logger';
import vendorSignupFormZodValidationSchema from '../formZodValidationSchema';
import { isProductionEnv } from '../../../utils/utils';

type FormStateFields = {
  fullname: string;
  email: string;
  password: string;
};

type FormState = FormStateFields & {
  touchedFieldList: (keyof FormStateFields)[];
  errors: null | Partial<FormStateFields>;
};

const initialFormState: FormState = {
  touchedFieldList: [],
  fullname: '',
  email: '',
  password: '',
  errors: null,
};

const useVendorSignup = () => {
  const [formState, setFormState] = React.useState<FormState>(initialFormState);
  const { fullname, email, password, errors, touchedFieldList } = formState;
  const haveErrors = !!errors;
  const _errors = errors ?? {};
  const isFullnameInputError = 'fullname' in _errors;
  const fullnameInputErrorMsg = _errors?.fullname || '';
  const isEmailInputError = 'email' in _errors;
  const emailInputErrorMsg = _errors?.email || '';
  const isPasswordInputError = 'password' in _errors;
  const passwordInputErrorMsg = _errors?.password || '';
  const isFormSubmitBtnDisabled = !touchedFieldList.length;
  const isDefaultValuesBtnVisible = false && !isProductionEnv;

  const updateFormState = (newState: Partial<FormState>) => {
    setFormState((oldVal) => ({
      ...oldVal,
      ...newState,
    }));
  };

  const enterTestValues = () => {
    if (isProductionEnv) return;
    updateFormState({
      fullname: 'aniket bhalla',
      email: 'aniket@gmail.com',
      password: 'aniKet2023$$',
    });
  };

  // NOTE: functionality not required but shouldn't be deleted
  const handleOnBlurEventOnFormInputFields = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    e.preventDefault();
    return;
    const interactedFieldName = e.target.name.trim() as keyof FormStateFields;
    const isInteractedFieldNameInTouchedFieldList =
      touchedFieldList.includes(interactedFieldName);
    if (isInteractedFieldNameInTouchedFieldList) return;

    updateFormState({
      touchedFieldList: [...formState.touchedFieldList, interactedFieldName],
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
      const validatedFormValues = await vendorSignupFormZodValidationSchema.parseAsync(
        formState
      );
      return validatedFormValues;
    } catch (error) {
      toast.error('Unable to create account 🫢');
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
      toast.success('Form submitted 🤤');
      logger.log({
        validatedFormValues,
      });
    } catch (error) {
      toast.error('Unable to create account 🫢');
      logger.error(error);
    }
  };

  return {
    validationState: {
      haveErrors,
      isFullnameInputError,
      fullnameInputErrorMsg,
      isEmailInputError,
      emailInputErrorMsg,
      isPasswordInputError,
      passwordInputErrorMsg,
      isFormSubmitBtnDisabled,
    },
    formState: {
      fullname,
      email,
      password,
      errors,
      enterTestValues,
    },
    isDefaultValuesBtnVisible,
    handleFormValues,
    handleFormSubmit,
    handleOnBlurEventOnFormInputFields,
  };
};

export default useVendorSignup;
