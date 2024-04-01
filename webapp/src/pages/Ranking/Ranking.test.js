import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Ranking from './Ranking';

describe('Ranking component', () => {
  test('renders loading state initially', () => {
    render(
      <Router>
        <Ranking />
      </Router>
    );
    expect(screen.getByText('Cargando ...')).toBeInTheDocument();
  });

  test('renders error message if fetching fails', async () => {
    // Mock fetch function to simulate failure
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(
      <Router>
        <Ranking />
      </Router>
    );

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });

    // Restore fetch
    global.fetch.mockRestore();
  });

  test('renders ranking table with data after successful fetch', async () => {
    // Mock successful fetch response
    const mockData = [{ username: 'user1', avgPoints: 50 }, { username: 'user2', avgPoints: 60 }];
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );
  
    render(
      <Router>
        <Ranking />
      </Router>
    );
  
    // Wait for table to be rendered with data
    await waitFor(() => {
      expect(screen.getByText('Usuario')).toBeInTheDocument();
      expect(screen.getAllByText('Puntos promedio')[1]).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
    });
  
    // Restore fetch
    global.fetch.mockRestore();
  });
  

  test('changes gamemode when clicking on mode buttons', async () => {
    const mockData = [{ username: 'user1', avgPoints: 50 }, { username: 'user2', avgPoints: 60 }];
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );
  
    render(
        <Router>
          <Ranking />
        </Router>
      );
    
      // Esperar a que se renderice la tabla con los datos
      await waitFor(() => {
        expect(screen.getByText('Usuario')).toBeInTheDocument();
        expect(screen.getAllByText('Puntos promedio')[1]).toBeInTheDocument(); 
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.getByText('60')).toBeInTheDocument();
      });
    
      const bateriaButton = screen.getByRole('button', { name: 'Batería de sabios' });
    
      fireEvent.click(bateriaButton);
    
      await waitFor(() => {
        expect(screen.getByText('Ranking - modo Batería de sabios')).toBeInTheDocument();
      });
    
      // Restaurar fetch
      global.fetch.mockRestore();
  });
});
