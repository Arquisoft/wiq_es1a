import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";
import UserGroups from './UserGroups';
import axios from 'axios';

jest.mock('axios');

const mockedGroups = [
  {
    _id: '1',
    name: 'Group 1',
    createdAt: '2024-04-11T12:00:00.000Z',
    members: ['testuser','user1', 'user2']
  },
  { 
    _id: '2',
    name: 'Group 2',
    createdAt: '2024-04-10T12:00:00.000Z',
    members: ['testuser','user3', 'user4']
  }
];

describe('UserGroups component', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
      });

    test('renders component', async () => {
        localStorage.setItem('username', 'testuser');
        axios.get.mockResolvedValueOnce({ data: { groups: [] } });
    
        render(
            <I18nextProvider i18n={i18n}>
                <MemoryRouter>
                    <UserGroups />
                </MemoryRouter>
            </I18nextProvider>
            );
    
        await waitFor(() => {
            expect(screen.getByText('Nombre del grupo')).toBeInTheDocument();
            expect(screen.getByText('Fecha de creación')).toBeInTheDocument();
            expect(screen.getByText('Creador')).toBeInTheDocument();
            expect(screen.getByText('Ver grupo')).toBeInTheDocument();
        });
    });

    test('fetches and displays user groups', async () => {
        localStorage.setItem('username', 'testuser');
        axios.get.mockResolvedValueOnce({ data: { groups: mockedGroups } });

        render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter>
            <UserGroups />
            </MemoryRouter>
        </I18nextProvider>
        );

        await waitFor(() => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.getByText('Group 2')).toBeInTheDocument();
        });
    });

    test('displays error message on fetch failure', async () => {
        localStorage.setItem('username', 'testuser');
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch groups'));

        render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter>
            <UserGroups />
            </MemoryRouter>
        </I18nextProvider>
        );

        await waitFor(() => {
        expect(screen.getByText('Error fetching data')).toBeInTheDocument();
        });
    });

    test('navigates to group details on click', async () => {
        localStorage.setItem('username', 'testuser');
        axios.get.mockResolvedValueOnce({ data: { groups: mockedGroups } });

        render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter>
            <UserGroups />
            </MemoryRouter>
        </I18nextProvider>
        );

        await waitFor(() => {
        const groupLink = screen.getByText('Group 1');
        userEvent.click(groupLink);
        });

        expect(window.location.pathname).toBe('/social/grupo/Group%201');
    });
});
