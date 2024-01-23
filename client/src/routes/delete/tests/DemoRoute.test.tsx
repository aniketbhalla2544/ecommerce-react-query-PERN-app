import { screen, render } from '@testing-library/react';
import DemoRoute from '@react-router-dom/routes/delete/DemoRoute';

test('should render welcome text', () => {
  render(<DemoRoute />);
  const headingElement = screen.getByText(/hello world/i);
  expect(headingElement.textContent).toBe('Hello world');
});
