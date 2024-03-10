import React from 'react';
import { render, screen } from '@testing-library/react';
import WrongRoute from './WrongRoute';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders 404 message', () => {
  render(
    <Router>
      <WrongRoute />
    </Router>
  );
  const errorMessage = screen.getByText(/404/i);
  expect(errorMessage).toBeInTheDocument();
});

test('renders "Página no encontrada" message', () => {
  render(
    <Router>
      <WrongRoute />
    </Router>
  );
  const notFoundMessage = screen.getByText(/Página no encontrada/i);
  expect(notFoundMessage).toBeInTheDocument();
});

test('renders link to home page', () => {
  render(
    <Router>
      <WrongRoute />
    </Router>
  );
  const homeLink = screen.getByRole('link', { name: /página principal/i });
  expect(homeLink).toHaveAttribute('href', '/login');
});