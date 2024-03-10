import React, { useState, useEffect } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Stats from './Stats';
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';



describe('Stats component', () => {
  test('renders loading state initially', () => {
    const { getByText } = render(<Stats />);
    expect(getByText('Cargando ...')).toBeInTheDocument();
  });

  test('renders error message if there is an error', async () => {
    // Mock fetchStats to throw an error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Test error'));

    const { getByText } = render(<Stats />);

    await waitFor(() => {
      expect(getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  test('renders stats when data is fetched successfully', async () => {
    const mockStats = {
      username: 'testuser',
      nGamesPlayed: 10,
      avgPoints: 20,
      totalPoints: 200,
      totalCorrectQuestions: 50,
      totalIncorrectQuestions: 10,
      ratioCorrectToIncorrect: 5,
      avgTime: 15,
    };

    // Mock fetchStats to return mockStats
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockStats),
    });

    const { getByText, getByTestId } = render(<Stats />);

    // Simulate user input and search
    fireEvent.change(getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.click(getByText('Buscar'));

    await waitFor(() => {
      expect(getByText('Usuario: testuser')).toBeInTheDocument();
      expect(getByText('Juegos Jugados: 10')).toBeInTheDocument();
      expect(getByText('Promedio de Puntos: 20')).toBeInTheDocument();
      expect(getByText('Puntos Totales: 200')).toBeInTheDocument();
      expect(getByText('Preguntas Correctas Totales: 50')).toBeInTheDocument();
      expect(getByText('Preguntas Incorrectas Totales: 10')).toBeInTheDocument();
      expect(getByText('Ratio Correctas/Incorrectas: 5')).toBeInTheDocument();
      expect(getByText('Tiempo por pregunta (s): 15')).toBeInTheDocument();
    });
  });

  test('displays message when user has not played any games', async () => {
    // Mock fetchStats to return null
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null),
    });

    const { getByText, getByTestId } = render(<Stats />);

    // Simulate user input and search
    fireEvent.change(getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.click(getByText('Buscar'));

    await waitFor(() => {
      expect(getByText('El usuario no ha jugado ninguna partida.')).toBeInTheDocument();
    });
  });
});
