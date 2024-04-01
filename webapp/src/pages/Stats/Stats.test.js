import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Stats from './Stats';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Stats component', () => {
  beforeEach(() => {
    // Limpiamos el localStorage antes de cada prueba
    localStorage.clear();
  });

  test('renders user statistics', async () => {
    render(
      <Router>
        <Stats />
      </Router>
    );

    // Espera hasta que el texto "Cargando ..." desaparezca
    await waitFor(() => {
      expect(screen.queryByText('Cargando ...')).not.toBeInTheDocument();
    });

    // Ahora, realiza las aserciones sobre las estadísticas
    const statisticWordArray = screen.getAllByText(/Estadísticas/i);
    statisticWordArray.forEach(statisticWord => {
      expect(statisticWord).toBeInTheDocument();
    });
  });

  test('fetches user statistics and displays them', async () => {
    const userData = {
      username: 'testUser',
      nGamesPlayed: 10,
      avgPoints: 7,
      totalPoints: 70,
      totalCorrectQuestions: 20,
      totalIncorrectQuestions: 5,
      ratioCorrect: 80,
      avgTime: 15
    };
  
    // Simulamos el usuario almacenado en localStorage
    localStorage.setItem('username', 'testUser'); // Establecer el nombre de usuario aquí
  
    // Mock de la respuesta de la API
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });
  
    // Renderizamos el componente
    render(
      <Router>
        <Stats />
      </Router>
    );
  

    // Verificamos que se muestre una tabla
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();

    // Verificar que la tabla contiene las columnas esperadas
    const columnHeaders = ['Partidas jugadas', 'Puntos por partida', 'Puntos totales', 'Preguntas correctas totales', 'Preguntas incorrectas totales', 'Porcentaje de aciertos', 'Tiempo por pregunta (s):'];
    columnHeaders.forEach(headerText => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });

    // Verificar que la tabla contiene los datos esperados
    expect(screen.getByText(userData.nGamesPlayed.toString())).toBeInTheDocument();
    expect(screen.getByText(userData.avgPoints.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(userData.totalPoints.toString())).toBeInTheDocument();
    expect(screen.getByText(userData.totalCorrectQuestions.toString())).toBeInTheDocument();
    expect(screen.getByText(userData.totalIncorrectQuestions.toString())).toBeInTheDocument();
    expect(screen.getByText(userData.ratioCorrect.toFixed(2) + '%')).toBeInTheDocument();
    expect(screen.getByText(userData.avgTime.toFixed(2))).toBeInTheDocument();
  });

  test('displays an error message when fetching statistics fails', async () => {
    // Simulamos el usuario almacenado en localStorage
    const userId = 'testUser';
    localStorage.setItem('username', userId);

    // Mock de la respuesta de la API para simular un error
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    // Renderizamos el componente
    render(
      <Router>
        <Stats />
      </Router>
    );

    // Verificamos que se muestre el mensaje de error
    await screen.findByText("Error: Failed to fetch");
  });

  test('updates user statistics when username changes', async () => {
    const userData = {
      username: 'testUser',
      nGamesPlayed: 10,
      avgPoints: 7,
      totalPoints: 70,
      totalCorrectQuestions: 20,
      totalIncorrectQuestions: 5,
      ratioCorrect: 80,
      avgTime: 15
    };
  
    // Simulamos el usuario almacenado en localStorage
    localStorage.setItem('username', 'testUser');
  
    // Mock de la respuesta de la API
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });
  
    // Renderizamos el componente
    render(
      <Router>
        <Stats />
      </Router>
    );

    await screen.findByRole('table');
  
    const newUsername = 'newUser';
    localStorage.setItem('username', newUsername);
  
    render(
      <Router>
        <Stats />
      </Router>
    );
  
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(newUsername));
  });
  
  test('updates user statistics when game mode changes', async () => {
    const userData = {
      username: 'testUser',
      nGamesPlayed: 10,
      avgPoints: 7,
      totalPoints: 70,
      totalCorrectQuestions: 20,
      totalIncorrectQuestions: 5,
      ratioCorrect: 80,
      avgTime: 15
    };
  
    // Simulamos el usuario almacenado en localStorage
    localStorage.setItem('username', 'testUser');
  
    // Mock de la respuesta de la API
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData)
    });
  
    // Renderizamos el componente
    render(
      <Router>
        <Stats />
      </Router>
    );
    await screen.findByRole('table');
    const modeButton = screen.getByRole('button', { name: /Batería de sabios/i });
    userEvent.click(modeButton);
  
    render(
      <Router>
        <Stats />
      </Router>
    );
    await waitFor(() => {
      expect(screen.queryByText('Estadísticas de testUser - modo Batería de sabios')).toBeInTheDocument();
    });

  });
});


