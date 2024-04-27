import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import AyudaEstadisticas from './AyudaEstadisticas'; 
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe('AyudaEstadisticas Component', () => {

  const renderComponentWithRouter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <AyudaEstadisticas />
        </Router>
      </I18nextProvider>
    );
  };

  it('renders component without crashing', () => {
    renderComponentWithRouter();
  });

  const checkDescription = (description) => {
    const { getByText } = renderComponentWithRouter();
    const descriptionElement = getByText(description);
    expect(descriptionElement).toBeInTheDocument();
  };

  it('renders the correct title and description', () => {
    checkDescription(/Nuestra aplicación cuenta con un sistema de estadísticas en la que podrás ver tus estadísticas en los distintos modos de juego, y a su vez también puedes ver las estadisticas de otros usuarios./i);
  });

  it('renders the correct second title and description', () => {
    checkDescription(/Nuestra aplicación también cuenta con un sistema de ranking donde podrás ver los usuarios con las mejores puntuaciones, y filtrarlo por distintos parámetros./i);
  });
});

