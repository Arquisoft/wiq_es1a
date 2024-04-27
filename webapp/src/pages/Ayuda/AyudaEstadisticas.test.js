import React from 'react';
import { render } from '@testing-library/react';
import AyudaEstadisticas from './AyudaEstadisticas'; 

describe('AyudaEstadisticas Component', () => {
  it('renders component without crashing', () => {
    render(<AyudaEstadisticas />);
  });

  it('renders the correct title', () => {
    const { getByText } = render(<AyudaEstadisticas />);
    const titleElement = getByText(/Estadísticas/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the correct description', () => {
    const { getByText } = render(<AyudaEstadisticas />);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con un sistema de Estadisticas en la que podrás ver tus estadisticas en los distintos modos de juego y a su vez también puedes ver las estadisticas de otros usuarios./i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct second title', () => {
    const { getByText } = render(<AyudaEstadisticas />);
    const title2Element = getByText(/Sistema de Ranking/i);
    expect(title2Element).toBeInTheDocument();
  });

  it('renders the correct second description', () => {
    const { getByText } = render(<AyudaEstadisticas />);
    const description2Element = getByText(/Nuestra aplicación también cuenta con un sistema de ranking donde podrás ver qué usuarios tienen las mejores puntuaciones./i);
    expect(description2Element).toBeInTheDocument();
  });
});
