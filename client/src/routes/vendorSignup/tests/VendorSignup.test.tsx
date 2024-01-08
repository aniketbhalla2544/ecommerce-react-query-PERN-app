import VendorSignup from '@react-router-dom/routes/vendorSignup/VendorSignup';
import { render, screen } from '@testing-library/react';

test.only('should render welcome message on signup page', () => {
  render(<VendorSignup />);
  const welcomeHeading = screen.getByText(/vendor registeration/i);
  expect(welcomeHeading.textContent).toBe('Vendor Registeration');
});
