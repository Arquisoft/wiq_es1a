import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GroupDetails from './GroupDetails';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const renderComponentWithRouter = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <GroupDetails />
        </Router>
      </I18nextProvider>
    );
  };

describe('GroupDetails', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ groupName: 'exampleGroup' });
    useNavigate.mockReturnValue(jest.fn());
  });

  it('renders loading text when group data is not yet fetched', () => {
    axios.get.mockResolvedValueOnce({ data: { group: null } });
    const { getByText } = renderComponentWithRouter();
    expect(getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders group details when data is fetched', async () => {
    const groupData = {
      groupName: 'exampleGroup',
      members: ['user1', 'user2'],
      createdAt: '2024-04-11T12:00:00Z',
    };
    axios.get.mockResolvedValueOnce({ data: { group: groupData } });
    const { getByText, getByTestId, queryByText } = renderComponentWithRouter();

    await waitFor(() => {
        expect(queryByText('Cargando...')).not.toBeInTheDocument();
      });
    
    await waitFor(() => {
      expect(getByText('Detalles del grupo exampleGroup')).toBeInTheDocument();
      expect(getByText('Creado por user1 el 4/11/2024')).toBeInTheDocument();
      expect(getByTestId('user-avatar-user1')).toBeInTheDocument();
      expect(getByTestId('user-avatar-user2')).toBeInTheDocument();
      expect(getByText('user1')).toBeInTheDocument();
      expect(getByText('user2')).toBeInTheDocument();
    });
  });

  it('redirects to user profile when view profile link is clicked', async () => {
    const groupData = {
      groupName: 'exampleGroup',
      members: ['user1'],
      createdAt: '2024-04-11T12:00:00Z',
    };
    axios.get.mockResolvedValueOnce({ data: { group: groupData } });
    const { getByRole, queryByText } = renderComponentWithRouter();

    await waitFor(() => {
        expect(queryByText('Cargando...')).not.toBeInTheDocument();
      });
    const viewProfileLink = getByRole('link', { name: 'Ver perfil' });
    fireEvent.click(viewProfileLink);
    expect(useNavigate).toHaveBeenCalledWith('/perfil?user=user1');
  });
});

