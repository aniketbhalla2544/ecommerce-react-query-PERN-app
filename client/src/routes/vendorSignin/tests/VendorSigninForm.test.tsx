import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VendorSignin from '@react-router-dom/routes/vendorSignin/VendorSignin';
import { renderWithRouter } from '@utils/tests/renderWithMemoryRouter';
// import { MemoryRouter } from 'react-router-dom';

describe('Vendor Sign-in Form', () => {
  // rendering the sign-in form page with route context before each test runs
  beforeEach(() => {
    renderWithRouter(<VendorSignin />, {
      route: '/sign-in',
    });
  });

  test('should have correct visible form heading', () => {
    const signinHeading = screen.getByText(/vendor sign in/i);
    expect(signinHeading.textContent).toBe('Vendor Sign In');
    expect(signinHeading).toBeVisible();
  });

  describe('email and password inputs', () => {
    test('should be accessible with correct labels', () => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    test('show render user input values', async () => {
      const user = userEvent.setup();

      // testing email input render
      const emailInput = screen.getByLabelText(/email/i);
      const testEmail = 'username@gmail.com';
      await user.type(emailInput, testEmail);
      expect(emailInput).toHaveValue(testEmail);

      // testing password input render
      const passwordInput = screen.getByLabelText(/password/i);
      const testPassword = 'user#$%ASDF234..asdfasfdfg';
      await user.type(passwordInput, testPassword);
      expect(passwordInput).toHaveValue(testPassword);
    });

    test('should have correct attributes', () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // assertions for email
      // expect(emailInput).toHaveAttribute('autofocus');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('value');
      expect(emailInput).toHaveAttribute('name');
      expect(emailInput).toHaveAttribute('id');

      // assertions for password
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('value');
      expect(passwordInput).toHaveAttribute('name');
      expect(passwordInput).toHaveAttribute('id');
    });
  });

  test("should have 'don't have an account?' question with create account text and correct link", () => {
    const noAccountQuestion = screen.getByText(/don't have an account/i);
    expect(noAccountQuestion.textContent?.trim()).toBe("Don't have an account?");

    const createAccountLink = screen.getByRole('link', {
      name: /create account/i,
    });
    expect(createAccountLink.textContent).toBe('Create Account');
    expect(createAccountLink).toHaveAttribute('href', '/register');
  });

  describe('initial state', () => {
    test('email input should have auto-focus on first page render', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveFocus();
    });

    test('email and password inputs should have correct placeholder or input values', () => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('placeholder', 'username@example.com');

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveValue('');
    });

    test('should have enabled sign-in button', () => {
      const signinButton = screen.getByRole('button', {
        name: /sign in/i,
      });
      expect(signinButton).toBeInTheDocument();
    });
  });

  describe('form submittions', () => {
    test('should be successful in case of positive response from backend', async () => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const signinButton = screen.getByRole('button', {
        name: /sign in/i,
      });

      // setting invalid email and password input values
      await user.type(emailInput, 'sadfsadf@s');
      await user.type(passwordInput, 'asdf');

      await act(async () => await user.click(signinButton));

      /**
       * upon clicking sign-in button with invalid credentials,
       * finding div with role alert which contains a visible descendant element
       *  with error message, incorrect email or password.
       */
      const errorAlert = await screen.findByRole('alert');
      const invalidCredentialsErrorMsg = screen.getByText(/incorrect email or password/i);

      expect(errorAlert).toContainElement(invalidCredentialsErrorMsg);
      expect(invalidCredentialsErrorMsg).toBeVisible();
    });
  });
});
