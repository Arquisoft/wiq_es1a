import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Perfil from './Perfil';

describe('Perfil Component', () => {

  test('renders user profile data after loading', async () => {
    const mockUserData = {
      username: 'testUser',
      createdAt: new Date(),
      games: [
        { gamemode: 'clasico', correctAnswers: 5, incorrectAnswers: 2, points: 20, avgTime: 10 },
        { gamemode: 'bateria', correctAnswers: 8, incorrectAnswers: 3, points: 35, avgTime: 15 }
      ]
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockUserData),
    });

    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('testUser')).toBeInTheDocument();
      expect(screen.getByText(/Fecha de creación de la cuenta:/i)).toBeInTheDocument();
      expect(screen.getByText('Partidas Recientes')).toBeInTheDocument();
      expect(screen.getByText('clasico')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });
  });

  test('displays an error message when profile loading fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));
  
    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  test('displays a message when there are no recent games', async () => {
    const mockUserData = {
      username: 'testUser',
      createdAt: new Date(),
      games: []
    };
  
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockUserData),
    });
  
    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('No hay partidas recientes.')).toBeInTheDocument();
    });
  });
  
  
});