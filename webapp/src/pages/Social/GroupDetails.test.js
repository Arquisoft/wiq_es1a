import React from 'react';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Routes, Route,MemoryRouter } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import GroupDetails from './GroupDetails';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

const renderComponentWithRouter = async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/groups/exampleGroup']}>
          <GroupDetails />
      </MemoryRouter>
      </I18nextProvider>
    );
    localStorage.setItem("username", "user1");
  };

const groupData = {
    name: 'exampleGroup',
    members: ['user1', 'user2'],
    createdAt: '2024-04-11T12:00:00Z',
  };

describe('GroupDetails', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });
  

    it('renders loading text when group data is not yet fetched', () => {
      global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(null),
        });
      renderComponentWithRouter();
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('renders group details when data is fetched', async () => {
      
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(groupData),
      });

      renderComponentWithRouter();

      console.log(screen)

      const table = await screen.findByRole("table");
      expect(table).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Detalles del grupo exampleGroup')).toBeInTheDocument();
        expect(screen.getByText('Creado por user1 el 4/11/2024')).toBeInTheDocument();
        expect(screen.getByTestId('user-avatar-user1')).toBeInTheDocument();
        expect(screen.getByTestId('user-avatar-user2')).toBeInTheDocument();
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
      });
    });

    it('redirects to user profile when view profile link is clicked', async () => {

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(groupData),
      });

      renderComponentWithRouter();

      const viewProfileLink = screen.getByRole('link', { name: 'Ver perfil' });
      fireEvent.click(viewProfileLink);
      expect(useNavigate).toHaveBeenCalledWith('/perfil?user=user1');
    });
});

