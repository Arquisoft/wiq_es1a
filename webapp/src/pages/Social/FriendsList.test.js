import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FriendList from "./FriendsList.js";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe("FriendList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });

    expect(screen.getByText("Cargando ...")).toBeInTheDocument();
  });

  test("renders friend list", async () => {
    const mockFriends = ["Friend 1", "Friend 2", "Friend 3"];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ friends: mockFriends }),
    });

    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Lista de amigos")).toBeInTheDocument();
      expect(screen.getByText("Friend 1")).toBeInTheDocument();
      expect(screen.getByText("Friend 2")).toBeInTheDocument();
    });
  });

  test("renders no friends message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ friends: [] }),
    });

    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });
    await waitFor(() => {
      expect(
        screen.getByText("No tienes amigos actualmente.")
      ).toBeInTheDocument();
    });
  });

  test("navigates to friend profile", async () => {
    const mockFriends = ["Friend 1", "Friend 2", "Friend 3"];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ friends: mockFriends }),
    });

    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });

    const data = {
      username: "admin",
      createdAt: "2024-01-30T14:59:11.576Z",
      games: [
        {
          correctAnswers: 5,
          incorrectAnswers: 4,
          points: 5,
          avgTime: 0,
        },
        {
          correctAnswers: 0,
          incorrectAnswers: 0,
          points: 0,
          avgTime: 0,
        },
      ],
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(data),
    });

    await waitFor(() => {
      expect(screen.getByText("Friend 1")).toBeInTheDocument();
      expect(screen.getByText("Friend 2")).toBeInTheDocument();
      expect(screen.getByText("Friend 3")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole("button", { name: /Ver perfil/i })[0]);

    await waitFor(() => {
      expect(screen.getByText("Perfil de usuario")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Volver/i }));
  });

  test("removes a friend", async () => {
    const mockFriends = ["Friend 1", "Friend 2", "Friend 3"];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ friends: mockFriends }),
    });
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: true });

    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Friend 1")).toBeInTheDocument();
      expect(screen.getByText("Friend 2")).toBeInTheDocument();
      expect(screen.getByText("Friend 3")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /eliminar amigo/i })[0]
    );

    expect(screen.queryByText("Friend 1")).toBeInTheDocument();
    expect(screen.getByText("Friend 2")).toBeInTheDocument();
    expect(screen.getByText("Friend 3")).toBeInTheDocument();
  });

  test("fetch returns error", async () => {
    global.fetch.mockRejectedValue(new Error("Failed to fetch"));
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false });
    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("No tienes amigos actualmente.")
      ).toBeInTheDocument();
    });
  });

  test("remove friend returns error", async () => {
    const mockFriends = ["Friend 1", "Friend 2", "Friend 3"];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ friends: mockFriends }),
    });
    
    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <FriendList />
          </MemoryRouter>
        </I18nextProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Friend 1")).toBeInTheDocument();
      expect(screen.getByText("Friend 2")).toBeInTheDocument();
      expect(screen.getByText("Friend 3")).toBeInTheDocument();
    });

    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Failed to fetch"));

    fireEvent.click(
      screen.getAllByRole("button", { name: /eliminar amigo/i })[0]
    );

    expect(screen.getByText("Friend 3")).toBeInTheDocument();
  });
});
