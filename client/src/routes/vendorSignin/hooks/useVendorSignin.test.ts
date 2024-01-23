import { renderHook, act } from '@testing-library/react';
import useVendorSignin, {
  FormState,
} from '@react-router-dom/routes/vendorSignin/hooks/useVendorSignin';

describe('Vendor sign-in custom hook', () => {
  describe('form state', () => {
    test('should have correct initial values', () => {
      const { result } = renderHook(() => useVendorSignin());

      const initialFormState: FormState = {
        signinStatus: 'idle',
        email: '',
        password: '',
        errors: null,
      };
      expect(result.current.formState).toStrictEqual(initialFormState);
    });
    test('case1: correctly updates with updateFormState() function', () => {
      const { result } = renderHook(() => useVendorSignin());

      // case 1: updating form state
      const stateUpdate: Partial<FormState> = {
        email: 'user@gmail.com',
        signinStatus: 'loading',
        errors: {
          email: 'email too short',
        },
      };
      const expectedState: FormState = {
        email: 'user@gmail.com',
        signinStatus: 'loading',
        password: '',
        errors: {
          email: 'email too short',
        },
      };
      act(() => result.current.form.updateFormState(stateUpdate));
      expect(result.current.formState).toStrictEqual(expectedState);
    });
    test('case2: correctly updates with updateFormState() function', () => {
      const { result } = renderHook(() => useVendorSignin());

      // case 1: updating form state
      const stateUpdate: Partial<FormState> = {
        email: 'user@gmail.com',
        errors: {
          email: 'email too short',
        },
      };
      const expectedState: FormState = {
        email: 'user@gmail.com',
        signinStatus: 'idle',
        password: '',
        errors: {
          email: 'email too short',
        },
      };
      act(() => result.current.form.updateFormState(stateUpdate));
      expect(result.current.formState).toStrictEqual(expectedState);
    });

    test('should have errors object set to null initially', () => {
      const { result } = renderHook(() => useVendorSignin());
      expect(result.current.formState.errors).toBeNull();
    });
  });

  describe('validation states derived from form state', () => {
    describe('haveErrors state', () => {
      test('should be false when form page refreshes', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.haveErrors).toBeFalsy();
      });

      test('should be true when form state have errors object', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              email: 'invalid email',
              password: 'incorrect password',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.haveErrors).toBeTruthy();
      });
    });

    // eslint-disable-next-line vitest/no-identical-title
    describe('isEmailInputError state', () => {
      test('should be false initially', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.isEmailInputError).toBeFalsy();
      });

      test('should be true when email input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              email: 'incorrect email',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.isEmailInputError).toBeTruthy();
      });
      test('should be false when is form error but not email input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              password: 'sdafsadf',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.isEmailInputError).toBeFalsy();
      });
    });

    describe('emailInputErrorMsg', () => {
      test('should be empty string initially when is no form error', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.emailInputErrorMsg).toBe('');
      });

      test("should have msg set by error object's email prop", () => {
        const errorMsg = 'incorrect email';
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              email: errorMsg,
            },
          })
        );
        expect(result.current.validationStates.emailInputErrorMsg).toBe(errorMsg);
      });
      test('should be empty string when is form error but not email input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              password: 'incorrect password',
            },
          })
        );
        expect(result.current.validationStates.emailInputErrorMsg).toBe('');
      });
    });

    describe('isPasswordInputError state', () => {
      test('should be false initially when no form error', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.isPasswordInputError).toBeFalsy();
      });

      test('should be true when password input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              password: 'incorrect password',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.isPasswordInputError).toBeTruthy();
      });
      test('should be false when is form error but not password input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              email: 'incorrect email',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.isPasswordInputError).toBeFalsy();
      });
    });

    describe('passwordInputErrorMsg', () => {
      test('should be empty string initially when is no form error', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.passwordInputErrorMsg).toBe('');
      });

      test("should have msg set by error object's password prop", () => {
        const errorMsg = 'incorrect password';
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              password: errorMsg,
            },
          })
        );
        expect(result.current.validationStates.passwordInputErrorMsg).toBe(errorMsg);
      });
      test('should be empty string when is form error but not password input error', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              email: 'incorrect email',
            },
          })
        );
        expect(result.current.formState.errors).not.toBeNull();
        expect(result.current.validationStates.passwordInputErrorMsg).toBe('');
      });
    });

    describe('isSigninStatusLoading', () => {
      test('should be false initially when page refreshes', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.formState.signinStatus).toBe('idle');
        expect(result.current.validationStates.isSigninStatusLoading).toBeFalsy();
      });

      test("should be true when signinStatus is 'loading'", () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            signinStatus: 'loading',
          })
        );
        expect(result.current.validationStates.isSigninStatusLoading).toBeTruthy();
      });
    });
    describe('allFormControlsDisabled', () => {
      test('should be false initially when page refreshes', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.allFormControlsDisabled).toBeFalsy();
      });

      test("should be true when signinStatus is 'loading'", () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            signinStatus: 'loading',
          })
        );
        expect(result.current.validationStates.allFormControlsDisabled).toBeTruthy();
      });
    });
    describe('isFormSubmitBtnDisabled', () => {
      test('should be false initially when page refreshes', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.isFormSubmitBtnDisabled).toBeFalsy();
      });

      test("should be true when signinStatus is 'loading'", () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            signinStatus: 'loading',
          })
        );
        expect(result.current.validationStates.isFormSubmitBtnDisabled).toBeTruthy();
        expect(result.current.validationStates.isFormSubmitBtnDisabled).toBeTruthy();
      });
    });
    describe('invalidCredentialsError', () => {
      test('should be false initially when page refreshes', () => {
        const { result } = renderHook(() => useVendorSignin());
        expect(result.current.validationStates.invalidCredentialsError).toBeFalsy();
      });

      test('should be true when invalidCredentials prop in errors object', () => {
        const { result } = renderHook(() =>
          useVendorSignin({
            errors: {
              invalidCredentials: true,
            },
          })
        );
        expect(result.current.validationStates.invalidCredentialsError).toBeTruthy();
      });
    });
  });

  describe('validateForm():', () => {
    test("should reset errors object to null upon it's call with valid user credentials", async () => {
      const validFormState = {
        email: 'username@gmail.com',
        password: 'sadf234AS@@&&adsf123',
      };

      const { result } = renderHook(() =>
        useVendorSignin({
          email: validFormState.email,
          password: validFormState.password,
          errors: {
            email: 'invalid email',
            password: 'incorrect password',
          },
        })
      );

      const validatedData = await act(async () => result.current.form.validateForm());
      expect(validatedData).toEqual(validFormState);
      expect(result.current.formState.errors).toBeNull();
    });

    test('should return valid form state credentials with no errors', async () => {
      const validUserCredentials = {
        email: 'username@gmail.com',
        password: '123',
      };
      const { result } = renderHook(() =>
        useVendorSignin({
          email: validUserCredentials.email,
          password: validUserCredentials.password,
        })
      );

      const validatedCredentials = await act(async () =>
        result.current.form.validateForm()
      );
      expect(validatedCredentials).not.toBe(undefined);
      expect(validatedCredentials).toStrictEqual(validUserCredentials);
      expect(result.current.formState.errors).toBeNull();
    });

    test('should throw error for invalid email in form state credentials with invalidCredentials prop in error object', async () => {
      const { result } = renderHook(() =>
        useVendorSignin({
          email: 'usernam',
          password: '123asdf',
        })
      );
      try {
        await act(async () => result.current.form.validateForm());
        expect.fail('validateForm should have thrown error for invalid email');
      } catch (error) {
        expect(result.current.formState.errors).toHaveProperty(
          'invalidCredentials',
          true
        );
      }
    });

    test('should throw error for invalid password in form state credentials with invalidCredentials prop in error object', async () => {
      const { result } = renderHook(() =>
        useVendorSignin({
          email: 'username@gmail.com',
          password: '',
        })
      );
      try {
        await act(async () => result.current.form.validateForm());
        expect.fail('validateForm should have thrown error for invalid password');
      } catch (error) {
        expect(result.current.formState.errors).toHaveProperty(
          'invalidCredentials',
          true
        );
      }
    });
  });

  test('updateSigninStatus should change signin status to error', () => {
    const { result } = renderHook(() => useVendorSignin());
    act(() => result.current.form.updateSigninStatus('error'));
    expect(result.current.formState.signinStatus).toBe('error');
  });
});
