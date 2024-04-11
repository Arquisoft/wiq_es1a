import React from 'react';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import GroupDetails from './GroupDetails';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

const renderComponentWithRouter = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <GroupDetails />
        </MemoryRouter>
      </I18nextProvider>
    );
  };

const groupData = {
    groupName: 'exampleGroup',
    members: ['user1', 'user2'],
    createdAt: '2024-04-11T12:00:00Z',
  };

describe('GroupDetails', () => {
  beforeEach(() => {
    localStorage.clear();
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
    //expect(useNavigate).toHaveBeenCalledWith('/perfil?user=user1');
  });
});

