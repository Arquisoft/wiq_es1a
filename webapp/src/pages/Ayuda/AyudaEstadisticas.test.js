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

  it('renders the correct title and description', () => {
    const { getByText,queryAllByRole  } = renderComponentWithRouter();
    const descriptionElement = getByText(/Nuestra aplicación cuenta con un sistema de estadísticas en la que podrás ver tus estadísticas en los distintos modos de juego, y a su vez también puedes ver las estadisticas de otros usuarios./i);

    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct second title and description', () => {
    const { getByText } = renderComponentWithRouter();
    const description2Element = getByText(/Nuestra aplicación también cuenta con un sistema de ranking donde podrás ver los usuarios con las mejores puntuaciones, y filtrarlo por distintos parámetros./i);

    expect(description2Element).toBeInTheDocument();
  });
});

