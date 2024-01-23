import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VendorSignup from '@react-router-dom/routes/vendorSignup/VendorSignup';

test.only('should render welcome message on signup page', () => {
  render(
    <MemoryRouter>
      <VendorSignup />
    </MemoryRouter>
  );
  const welcomeHeading = screen.getByText(/vendor registeration/i);
  expect(welcomeHeading.textContent).toBe('Vendor Registeration');
});
