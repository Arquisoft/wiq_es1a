import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders welcome message', () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const welcomeElement = screen.getByText(/Bienvenido/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders game modes', () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const classicLink = screen.getByText(/Modo Clásico/i);
  const batteryLink = screen.getByText(/Batería de Sabios/i);

  expect(classicLink).toBeInTheDocument();
  expect(batteryLink).toBeInTheDocument();
});
