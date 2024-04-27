import React from 'react';
import { render } from '@testing-library/react';
import AyudaModosJuego from './AyudaModosJuego'; 

describe('AyudaModosJuego Component', () => {
  it('renders component without crashing', () => {
    render(<AyudaModosJuego />);
  });

  it('renders the correct title', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const titleElement = getByText(/Modos de Juego/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the correct description', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con 3 modos de juego en los que podrás entretenerte todo el tiempo que quieras y conseguir obtener la mejor puntuación./i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct classic mode title', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const classicModeTitle = getByText(/Modo Clásico/i);
    expect(classicModeTitle).toBeInTheDocument();
  });

  it('renders the correct classic mode description', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const classicModeDescription = getByText(/En el modo clásico tendrás que responder a una serie de preguntas en un tiempo determinado por pregunta/i);
    expect(classicModeDescription).toBeInTheDocument();
  });

  it('renders the correct sabios mode title', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const sabiosModeTitle = getByText(/Batería de Sabios/i);
    expect(sabiosModeTitle).toBeInTheDocument();
  });

  it('renders the correct sabios mode description', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const sabiosModeDescription = getByText(/En el modo de batería de sabios tendrás que responder de forma correcta el máximo de preguntas en un tiempo límite/i);
    expect(sabiosModeDescription).toBeInTheDocument();
  });

  it('renders the correct calculator mode title', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const calculatorModeTitle = getByText(/Calculadora Humana/i);
    expect(calculatorModeTitle).toBeInTheDocument();
  });

  it('renders the correct calculator mode description', () => {
    const { getByText } = render(<AyudaModosJuego />);
    const calculatorModeDescription = getByText(/En el modo Calculadora Humana tendrás que responder a operaciones matemáticas como si de una calculadora te trataras/i);
    expect(calculatorModeDescription).toBeInTheDocument();
  });
});
