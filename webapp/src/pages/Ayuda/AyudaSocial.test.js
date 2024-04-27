import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import AyudaSocial from './AyudaSocial';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe('AyudaSocial Component', () => {

  const renderComponentWithRouter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <AyudaSocial />
        </Router>
      </I18nextProvider>
    );
  };

  it('renders component without crashing', () => {
    renderComponentWithRouter();
  });

  it('renders the correct title and description', () => {
    const { getByText } = renderComponentWithRouter();
    const titleElement = getByText(/Ayuda: Social/i);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con un apartado Social donde podrás compartir tu experiencia de juego con otros usuarios./i);
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct friends section title and description', () => {
    const { getByText } = renderComponentWithRouter();

    const friendsDescription = getByText(/Podrás buscar los usuarios del sistema y añadirlos como amigos para así acceder a su perfil de forma más fácil./i);

    expect(friendsDescription).toBeInTheDocument();
  });

  it('renders the correct groups section title and description', () => {
    const { getByText } = renderComponentWithRouter();

    const groupsDescription = getByText(/Podrás crear o unirte a un grupo ya existente con otros usuarios para poder ver su perfil y partidas recientes, y compartir tu experiencia con ellos./i);

    expect(groupsDescription).toBeInTheDocument();
  });
});

