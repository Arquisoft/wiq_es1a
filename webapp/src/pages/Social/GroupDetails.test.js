import React from 'react';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import GroupDetails from './GroupDetails';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

const renderComponentWithRouter = async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter >
          <GroupDetails />
      </MemoryRouter>
      </I18nextProvider>
    );
    localStorage.setItem("username", "user1");
  };

let originalFetch;

beforeEach(() => {
  originalFetch = global.fetch;
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

const groupData = {
  group : {
    name: 'exampleGroup',
    members: ['user1', 'user2'],
    createdAt: '2024-04-11T12:00:00Z',
  }
  };

const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

const checks = (async () => {
  await waitFor(() => {
    expect(screen.getByText('Detalles del grupo exampleGroup')).toBeInTheDocument();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    const viewProfile = screen.getAllByText('Ver perfil');
      expect(viewProfile).toHaveLength(3);
    expect(screen.getByTestId('user-avatar-user1')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar-user2')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });
});

describe('GroupDetails', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });
  

    it('renders loading text when group data is not yet fetched', () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: jest.fn().mockResolvedValueOnce(groupData),
      });
      renderComponentWithRouter();
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('renders group details when data is fetched', async () => {
      
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(groupData),
      });

      renderComponentWithRouter();
      
      await checks();
    });

    it('redirects to user profile when view profile link is clicked', async () => {

      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(groupData),
      });

      renderComponentWithRouter();

      await checks();
      
      const viewProfileButtons = screen.getByTestId('view-profile-button-user1');

      fireEvent.click(viewProfileButtons);
    });
});

