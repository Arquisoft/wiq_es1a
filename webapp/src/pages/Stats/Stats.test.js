import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Stats from './Stats';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const userData = {
  username: 'testUser',
  nGamesPlayed: 10,
  avgPoints: 7.00,
  totalPoints: 70,
  totalCorrectQuestions: 20,
  totalIncorrectQuestions: 5,
  ratioCorrect: 80.00,
  avgTime: 15.00
};

const renderComponentWithRouter = () => {
  render(
    <Router>
      <Stats />
    </Router>
  );
};

describe('Stats component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders user statistics', async () => {
    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.queryByText('Cargando ...')).not.toBeInTheDocument();
    });

    const statisticWordArray = screen.getAllByText(/Estadísticas/i);
    statisticWordArray.forEach(statisticWord => {
      expect(statisticWord).toBeInTheDocument();
    });
  });

  test('fetches user statistics and displays them', async () => {
    localStorage.setItem('username', 'testUser');
  
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });
  
    renderComponentWithRouter();
  
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
  
    const columnHeaders = ['Partidas jugadas', 'Puntos por partida', 'Puntos totales', 'Preguntas correctas totales', 'Preguntas incorrectas totales', 'Porcentaje de aciertos', 'Tiempo por pregunta (s):'];
    columnHeaders.forEach(headerText => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'username') {
        if (key === 'avgPoints'  || key === 'avgTime') {
          expect(screen.getByText(value.toFixed(2))).toBeInTheDocument();
        } else if(key==='ratioCorrect'){
          expect(screen.getByText(value.toFixed(2) + "%")).toBeInTheDocument();
        } else {
          expect(screen.getByText(value.toString())).toBeInTheDocument();
        }
      }
    });
  });
  

  test('displays an error message when fetching statistics fails', async () => {
    const userId = 'testUser';
    localStorage.setItem('username', userId);

    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    renderComponentWithRouter();

    await screen.findByText("Error: Failed to fetch");
  });

  test('updates user statistics when username changes', async () => {
    localStorage.setItem('username', 'testUser');

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });

    renderComponentWithRouter();

    await screen.findByRole('table');

    const newUsername = 'newUser';
    localStorage.setItem('username', newUsername);

    const searchButton = await screen.findByText('Buscar');
    userEvent.click(searchButton);

    renderComponentWithRouter();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(newUsername));
  });

  test('updates user statistics when game mode changes', async () => {
    localStorage.setItem('username', 'testUser');

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });

    renderComponentWithRouter();
    await screen.findByRole('table');

    const modeButton = screen.getByRole('button', { name: /Batería de sabios/i });
    userEvent.click(modeButton);

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.queryByText('Estadísticas de testUser - modo Batería de sabios')).toBeInTheDocument();
    });
  });
});
