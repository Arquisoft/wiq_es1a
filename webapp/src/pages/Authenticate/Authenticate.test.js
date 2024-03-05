import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Authenticate from './Authenticate';

test('renders welcome message', () => {
  const { getByText } = render(<Authenticate />);
  const welcomeMessage = getByText(/Bienvenido a WIQ/i);
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders login form by default', () => {
  const { getByLabelText } = render(<Authenticate />);
  const usernameInput = getByLabelText(/username/i);
  const passwordInput = getByLabelText(/password/i);
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('renders registration form when "Regístrate" link is clicked', () => {
  const { getByText, getByLabelText } = render(<Authenticate />);
  const registrationLink = getByText(/¿No tienes cuenta? Regístrate./i);
  fireEvent.click(registrationLink);
  const usernameInput = getByLabelText(/username/i);
  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  expect(usernameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('renders login form when "Inicia sesión" link is clicked', () => {
  const { getByText, getByLabelText } = render(<Authenticate />);
  const loginLink = getByText(/Ya tienes cuenta? Inicia sesión./i);
  fireEvent.click(loginLink);
  const usernameInput = getByLabelText(/username/i);
  const passwordInput = getByLabelText(/password/i);
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});
