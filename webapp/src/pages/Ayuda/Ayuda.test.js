import React from 'react';
import { render } from '@testing-library/react';
import Ayuda from './Ayuda'; 

describe('Ayuda Component', () => {
  it('renders component without crashing', () => {
    render(<Ayuda />);
  });
  
  it('renders the correct title', () => {
    const { getByText } = render(<Ayuda />);
    const titleElement = getByText(/Centro de ayuda/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the correct description', () => {
    const { getByText } = render(<Ayuda />);
    const descriptionElement = getByText(/Bienvenido al centro de ayuda de nuestra aplicación. Aquí encontrarás información útil para sacar el máximo provecho de nuestra juego/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct help categories', () => {
    const { getByText } = render(<Ayuda />);
    const gameModesElement = getByText(/Ayuda: Modos de juego/i);
    const socialHelpElement = getByText(/Ayuda: Social/i);
    const statsHelpElement = getByText(/Ayuda: Estadisticas/i);

    expect(gameModesElement).toBeInTheDocument();
    expect(socialHelpElement).toBeInTheDocument();
    expect(statsHelpElement).toBeInTheDocument();
  });

  it('renders the correct more details links', () => {
    const { getByText } = render(<Ayuda />);
    const gameModesLink = getByText(/Más detalles/i);
    const socialHelpLink = getByText(/Más detalles/i);
    const statsHelpLink = getByText(/Más detalles/i);

    expect(gameModesLink).toBeInTheDocument();
    expect(socialHelpLink).toBeInTheDocument();
    expect(statsHelpLink).toBeInTheDocument();
  });
});
