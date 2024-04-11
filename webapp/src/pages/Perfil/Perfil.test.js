import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Perfil from "./Perfil";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe("Perfil Component", () => {
  test("renders user profile data after loading", async () => {
    const mockUserData = {
      username: "testUser",
      createdAt: new Date(),
      games: [
        {
          gamemode: "clasico",
          correctAnswers: 5,
          incorrectAnswers: 2,
          points: 20,
          avgTime: 10,
        },
        {
          gamemode: "bateria",
          correctAnswers: 8,
          incorrectAnswers: 3,
          points: 35,
          avgTime: 15,
        },
      ],
    };

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValueOnce(mockUserData),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Perfil />
        </MemoryRouter>
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("testUser")).toBeInTheDocument();
      expect(
        screen.getByText(/Fecha de creación de la cuenta/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Partidas recientes")).toBeInTheDocument();
      expect(screen.getByText("clasico")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("35")).toBeInTheDocument();
    });
  });

  test("displays an error message when profile loading fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValueOnce({
      ok: false,
      json: () => Promise.resolve(new Error("Error")),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Perfil />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Ha habido un error al intentar cargar la información del usuario. Inténtalo más tarde.")).toBeInTheDocument();
    });
  });

  test("displays a message when there are no recent games", async () => {
    const mockUserData = {
      username: "testUser",
      createdAt: new Date(),
      games: [],
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Perfil />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No hay partidas recientes.")
      ).toBeInTheDocument();
    });
  });
});

test("displays recent calculator game data", async () => {
  const mockUserData = {
    username: "testUser",
    createdAt: new Date(),
    games: [{ gamemode: "calculadora", points: 15, avgTime: 8.5 }],
  };

  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockUserData),
  });

  render(
    <MemoryRouter>
      <Perfil />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("calculadora")).toBeInTheDocument();
    const dashCells = screen.getAllByText("-");
    expect(dashCells.length).toBe(2);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8.50 segundos")).toBeInTheDocument();
  });
});
