import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";
import Groups from './Groups';

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

global.fetch = jest.fn(); // Mock fetch function

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

  test('fetches and displays joinable groups', async () => {
    localStorage.setItem('username', 'testUser');

    fetch.mockResolvedValueOnce({
        json: async () => ({ groups: mockedGroups })
      });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });
  });

  test('displays error message on group creation failure', async () => {
    localStorage.setItem('username', 'testUser');

    fetch.mockResolvedValueOnce({
        json: async () => ({ groups: mockedGroups })
      });

    fetch.mockResolvedValueOnce({
        ok: false
      });

    renderComponentWithRouter();

    const addButton = screen.getByRole('button', { name: 'Crear' });
    userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to create group')).toBeInTheDocument();
    });
  });

  test('successfully joins a group', async () => {
    localStorage.setItem('username', 'testUser');

    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ groups: mockedGroups })
      });
    fetch.mockResolvedValueOnce({ ok: true});

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

  test('successfully joins both groups', async () => {
    localStorage.setItem('username', 'testUser');

    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ groups: mockedGroups })
      });
    fetch.mockResolvedValueOnce({ ok: true});
    fetch.mockResolvedValueOnce({ ok: true});

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    var joinButton = screen.getByText('Group 1').closest('tr').querySelector('button');
    userEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    });

    joinButton = screen.getByText('Group 2').closest('tr').querySelector('button');
    userEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
    });
  });

});
