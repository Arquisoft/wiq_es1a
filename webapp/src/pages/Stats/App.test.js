import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Stats from './Stats';

jest.mock('axios', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        username: 'testUser',
        nGamesPlayed: 5,
        avgPoints: 20,
        totalPoints: 100,
        totalCorrectQuestions: 30,
        totalIncorrectQuestions: 10,
        ratioCorrectToIncorrect: 3,
        avgTime: 10,
      },
    })
  ),
}));

describe('Stats component', () => {
  it('renders username input field', () => {
    render(<Stats />);
    expect(screen.getByLabelText('Nombre de Usuario:')).toBeInTheDocument();
  });

  it('renders loading message initially', () => {
    render(<Stats />);
    expect(screen.getByText(/Cargando .../i)).toBeInTheDocument();
  });

  it('fetches stats on search button click', async () => {
    render(<Stats />);
    const searchButton = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(searchButton);
    await waitFor(() => expect(screen.getByText(/Usuario: testUser/i)).toBeInTheDocument());
  });

  it('handles error correctly', async () => {
    // Mocking axios.get to simulate an error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.mock('axios', () => ({
      get: jest.fn(() => Promise.reject(new Error('Request failed'))),
    }));

    render(<Stats />);
    const searchButton = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(searchButton);
    await waitFor(() => expect(screen.getByText(/Error: Request failed/i)).toBeInTheDocument());
  });

  it('displays stats correctly', async () => {
    render(<Stats />);
    const searchButton = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(searchButton);
    await waitFor(() => expect(screen.getByText(/Juegos Jugados: 5/i)).toBeInTheDocument());
    expect(screen.getByText(/Promedio de Puntos: 20/i)).toBeInTheDocument();
    expect(screen.getByText(/Puntos Totales: 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas Correctas Totales: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas Incorrectas Totales: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Ratio Correctas\/Incorrectas: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Tiempo por pregunta \(s\): 10/i)).toBeInTheDocument();
  });
});
