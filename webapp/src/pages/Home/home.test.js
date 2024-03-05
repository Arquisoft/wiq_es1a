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
  const classicLink = screen.getByText(/Clásico/i);
  const batteryLink = screen.getByText(/Batería de sabios/i);
  const discardingLink = screen.getByText(/Descartando/i);
  const hotQuestionLink = screen.getByText(/La pregunta caliente/i);
  const discoveringCitiesLink = screen.getByText(/Descubriendo ciudades/i);

  expect(classicLink).toBeInTheDocument();
  expect(batteryLink).toBeInTheDocument();
  expect(discardingLink).toBeInTheDocument();
  expect(hotQuestionLink).toBeInTheDocument();
  expect(discoveringCitiesLink).toBeInTheDocument();
});
