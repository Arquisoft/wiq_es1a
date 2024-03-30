import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Stats from './Stats';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ 
      username: 'testUser',
      nGamesPlayed: 10,
      avgPoints: 25.5,
      totalPoints: 255,
      totalCorrectQuestions: 200,
      totalIncorrectQuestions: 50,
      ratioCorrect: 80,
      avgTime: 10
    }),
  })
);

describe('Stats component', () => {

  test('renders stats after loading', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText('Estadísticas de testUser - modo Clásico')).toBeInTheDocument());
    expect(getByText('Partidas jugadas')).toBeInTheDocument();
    expect(getByText('Puntos por partida')).toBeInTheDocument();
  });

  test('updates stats when changing username', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText('Estadísticas de testUser - modo Clásico')).toBeInTheDocument());
    fireEvent.change(getByLabelText('Nombre de usuario:'), { target: { value: 'newUser' } });
    fireEvent.click(getByText('Clásico'));
    await waitFor(() => expect(getByText('Estadísticas de newUser - modo Clásico')).toBeInTheDocument());
  });

  test('renders error message if stats fetch fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('fetch failed'));
    const { getByText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText('El usuario no ha jugado ninguna partida.')).toBeInTheDocument());
  });

  test('renders message for user with no stats', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => null }));
    const { getByText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText('El usuario no ha jugado ninguna partida.')).toBeInTheDocument());
  });

  test('updates stats when clicking game mode buttons', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
  
    await waitFor(() => expect(getByText('Estadísticas de testUser - modo Clásico')).toBeInTheDocument());
  
    const bateriaButton = getByRole('button', { name: /Batería de sabios/i });
    fireEvent.click(bateriaButton);
  
    await waitFor(() => expect(getByText('Estadísticas de testUser - modo Batería de sabios')).toBeInTheDocument());
  });

  test('updates username state when input changes with timeout', async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    );
  
    const usernameInput = getByLabelText('Nombre de usuario:');
    fireEvent.change(usernameInput, { target: { value: 'user' } });
  
    // Espera un breve intervalo de tiempo
    await new Promise((resolve) => setTimeout(resolve, 300));
  
    // Verifica que el valor del campo de nombre de usuario se haya actualizado
    expect(usernameInput.value).toBe('user');
  });
  
});


