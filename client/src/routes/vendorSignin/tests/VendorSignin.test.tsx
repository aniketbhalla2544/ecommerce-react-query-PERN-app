import { render, screen } from '@testing-library/react';
import VendorSignin from '../VendorSignin';
import { MemoryRouter } from 'react-router-dom';

test('testing vendor signin form initial state', () => {
  render(
    <MemoryRouter initialEntries={['/sign-in']}>
      <VendorSignin />
    </MemoryRouter>
  );

  // checking sign in heading
  const signinHeading = screen.getByText(/vendor sign in/i);
  console.log('signinHeading: ', signinHeading);
  expect(signinHeading.textContent).toBe('Vendor Sign In');
});
