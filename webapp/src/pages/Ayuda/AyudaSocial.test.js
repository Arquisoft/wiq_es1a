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

  const checkSectionDescription = (section, description) => {
    it(`renders the correct ${section} section description`, () => {
      const { getByText } = renderComponentWithRouter();
      const descriptionElement = getByText(description);
      expect(descriptionElement).toBeInTheDocument();
    });
  };

  it('renders the correct title and description', () => {
    const { getByText } = renderComponentWithRouter();
    const titleElement = getByText(/Ayuda: Social/i);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con un apartado Social donde podras compartir tu experiencia de juego con otros usuarios./i);
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  checkSectionDescription('friends', /Podrás buscar los usuarios del sistema y añadirlos como amigos para así acceder a su perfil de forma más fácil./i);
  checkSectionDescription('groups', /Podrás crear o unirte a un grupo ya existente con otros usuarios para poder ver su perfil y partidas recientes, y compartir tu experiencia con ellos./i);
});


