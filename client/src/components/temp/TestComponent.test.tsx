import TestComponent from '@components/temp/TestComponent';
import { render, screen } from '@testing-library/react';

test.only('a test to check if tests are working', () => {
  render(<TestComponent />);
  const heading = screen.getByText(/testing component for jest/i);
  expect(heading.textContent).toBe('Testing component for jest testing.');
});
