import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

// Mock de la función fetch
const mockData = [
  { _id: "1", username: "user1", isFriend: false },
  { _id: "2", username: "user2", isFriend: true },
];

// Antes de cada prueba, limpiar los mocks
beforeEach(() => {
  jest.clearAllMocks();
});

describe("UsersPage", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <UsersPage />
        </MemoryRouter>
      </I18nextProvider>
    );
  });

  test("renders loading message", () => {
    expect(screen.getByText("Cargando usuarios ...")).toBeInTheDocument();
  });

  test("renders error message", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch error"))
    );

    await waitFor(() => {
      expect(screen.getByText("Ya sois amigos")).toBeInTheDocument();
    });
  });

  test("renders user list", async () => {
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
    });
  });

  test("adds friend successfully", async () => {
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Añadir amigo/i })[0]
    );

    await waitFor(() => {
      expect(screen.getByText("Ya sois amigos")).toBeInTheDocument();
    });
  });

  test("handles add friend error", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Add friend error" }),
      })
    );

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Añadir amigo/i })[0]
    );

    await waitFor(() => {
      expect(screen.getByText("Ya sois amigos")).toBeInTheDocument();
    });
  });

});

