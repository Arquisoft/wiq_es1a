import React from 'react';
import { render } from '@testing-library/react';
import AyudaSocial from './AyudaSocial'; // Ajusta la ruta según la estructura de tu proyecto

describe('AyudaSocial Component', () => {
  it('renders component without crashing', () => {
    render(<AyudaSocial />);
  });

  it('renders the correct title', () => {
    const { getByText } = render(<AyudaSocial />);
    const titleElement = getByText(/Ayuda: Social/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the correct description', () => {
    const { getByText } = render(<AyudaSocial />);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con un apartado Social donde podrás compartir tu experiencia de juego con otros usuarios./i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct friends section title', () => {
    const { getByText } = render(<AyudaSocial />);
    const friendsTitle = getByText(/Amigos/i);
    expect(friendsTitle).toBeInTheDocument();
  });

  it('renders the correct friends section description', () => {
    const { getByText } = render(<AyudaSocial />);
    const friendsDescription = getByText(/Podremos buscar los usuarios del sistema y añadirlos como amigos para así acceder a sus estadísticas de forma más fácil./i);
    expect(friendsDescription).toBeInTheDocument();
  });

  it('renders the correct groups section title', () => {
    const { getByText } = render(<AyudaSocial />);
    const groupsTitle = getByText(/Grupos/i);
    expect(groupsTitle).toBeInTheDocument();
  });

  it('renders the correct groups section description', () => {
    const { getByText } = render(<AyudaSocial />);
    const groupsDescription = getByText(/Podremos crear o unirnos a un grupo ya existente con otros usuarios para así poder acceder a sus estadísticas y compararnos con ellos./i);
    expect(groupsDescription).toBeInTheDocument();
  });
});
