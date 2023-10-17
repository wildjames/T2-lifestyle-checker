import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders T2 - Lifestyle Checker component', () => {
  render(<App />);
  const headingElement = screen.getByText(/T2 - Lifestyle Checker/i);
  expect(headingElement).toBeInTheDocument();
  const nhsNumberElement = screen.getByText(/NHS Number:/i);
  expect(nhsNumberElement).toBeInTheDocument();
  const surnameElement = screen.getByText(/Surname:/i);
  expect(surnameElement).toBeInTheDocument();
  const dobElement = screen.getByText(/Date of Birth:/i);
  expect(dobElement).toBeInTheDocument();
});
