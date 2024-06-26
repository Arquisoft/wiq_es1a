import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import AyudaJuego from './AyudaJuego'; 
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe('AyudaJuego Component', () => {

  const renderComponentWithRouter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <AyudaJuego />
        </Router>
      </I18nextProvider>
    );
  };

  it('renders component without crashing', () => {
    renderComponentWithRouter();
  });

  const checkModeDescription = (mode, description) => {
    it(`renders the correct ${mode} mode title and description`, () => {
      const { getByText } = renderComponentWithRouter();
      const modeDescription = getByText(description);
      expect(modeDescription).toBeInTheDocument();
    });
  };

  it('renders the correct title and description', () => {
    const { getByText } = renderComponentWithRouter();
    const titleElement = getByText(/Ayuda: Modos de Juego/i);
    const descriptionElement = getByText(/Nuestra aplicación cuenta con 3 modos de juego en los que podrás entretenerte todo el tiempo que quieras y conseguir obtener la mejor puntuación. Todos ellos tienen la siguiente estructura: cuentan con cuatro opciones de respuesta en la que solo una es la correcta, y hay una barra de tiempo que te indica el tiempo restante. A continuación se detallarán los juegos y se dará un breve ejemplo de su funcionamiento/i);
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  checkModeDescription('classic', /En el modo Clásico tendrás que responder a una serie de preguntas en un tiempo determinado por pregunta. Tras responder una pregunta, la respuesta correcta se pondrá de color verde y, si has fallado, tu respuesta se pondrá en rojo./i);
  checkModeDescription('sabios', /En el modo de Batería de Sabios tendrás que responder de forma correcta el máximo de preguntas en un tiempo limite./i);
  checkModeDescription('calculator', /En el modo Calculadora Humana tendrás que responder a operaciones matemáticas. La partida acaba cuando fallas./i);
});


