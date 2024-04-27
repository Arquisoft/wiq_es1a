import React from 'react';
import { render } from '@testing-library/react';
import Ayuda from './Ayuda'; 
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe('Ayuda Component', () => {

  const renderComponentWithRouter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Ayuda />
        </Router>
      </I18nextProvider>
    );
  };

  it('renders component without crashing', () => {
    renderComponentWithRouter();
  });
  
  it('renders the correct title and description', () => {
    const { getByText, getAllByText } = renderComponentWithRouter();
    const titleElement = getByText("Centro de ayuda");
    const descriptionElement = getByText(/Bienvenido al centro de ayuda de nuestra aplicación. Aquí encontrarás información útil para sacar el máximo provecho de nuestra juego/i);
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the correct help categories and descriptions with more details links', () => {
    const { getByText,getAllByText } = renderComponentWithRouter();

    const categoriesAndDescriptions = [
      {
        description: /En nuestra aplicación tenemos 3 modos de juego con los que podrás entretenerte, en esta sección esperamos responder todas tus dudas./,
        moreDetails: /Más detalles/
      },
      {
        description: /Tenemos diferentes maneras de interactuar con otros usuarios, si tienes dudas sobre como hacerlo esta es tu sección./,
        moreDetails: /Más detalles/
      },
      {
        description: /Tenemos un modo para poder ver todas tus estadísticas para cada modo de juego, si tienes alguna duda esta es tu sección/,
        moreDetails: /Más detalles/
      }
    ];

    categoriesAndDescriptions.forEach(({ description, moreDetails }) => {
      const descriptionElement = getByText(description);
      const moreDetailsLinks = getAllByText(moreDetails);
    
      expect(descriptionElement).toBeInTheDocument();
      expect(moreDetailsLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});
