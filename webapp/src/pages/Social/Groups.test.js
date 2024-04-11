import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";
import axios from 'axios';
import Groups from './Groups';

jest.mock('axios');

const mockedGroups = [
    {
      _id: '1',
      name: 'Group 1',
      createdAt: '2024-04-11T12:00:00.000Z',
      members: ['user1', 'user2']
    },
    {
      _id: '2',
      name: 'Group 2',
      createdAt: '2024-04-10T12:00:00.000Z',
      members: ['user3', 'user4']
    }
  ];

const renderComponentWithRouter = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Groups />
        </MemoryRouter>
      </I18nextProvider>
    );
  };

describe('Groups component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders groups component', async () => {

    localStorage.setItem('username', 'testUser');

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.queryByText('Cargando ...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Tus grupos')).toBeInTheDocument();
  });

  test('fetches and displays joinable groups', async () => {

    localStorage.setItem('username', 'testUser');

    axios.get.mockResolvedValueOnce({ data: { groups: mockedGroups } });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });
  });

  test('displays error message on group creation failure', async () => {
    localStorage.setItem('username', 'testUser');

    axios.post.mockRejectedValueOnce(new Error('Failed to create group'));

    renderComponentWithRouter();

    const addButton = screen.getByRole('button', { name: 'Crear' });
    userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to create group')).toBeInTheDocument();
    });
  });

  test('successfully joins a group', async () => {
    localStorage.setItem('username', 'testUser');

    axios.get.mockResolvedValueOnce({ data: { groups: mockedGroups } });
    axios.post.mockResolvedValueOnce();

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const joinButton = screen.getByText('Group 1').closest('tr').querySelector('button');
    userEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    });
  });

});