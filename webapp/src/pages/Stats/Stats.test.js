import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Stats from "./Stats";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

const userData = {
  "_id": "65fc58fba0ffce7c435e733e",
  "username": "admin",
  "gamemode": "clasico",
  "nGamesPlayed": 27,
  "avgPoints": 0.9629629629629629,
  "totalPoints": 26,
  "totalCorrectQuestions": 26,
  "totalIncorrectQuestions": 214,
  "ratioCorrect": 10.833333333333334,
  "avgTime": 0.8445061728394961,
  "__v": 0
};

const renderComponentWithRouter = () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Stats />
      </Router>
    </I18nextProvider>
  );
};

describe("Stats component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders user statistics", async () => {
    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.queryByText("Cargando ...")).not.toBeInTheDocument();
    });

    const statisticWordArray = screen.getAllByText(/Estadísticas/i);
    statisticWordArray.forEach((statisticWord) => {
      expect(statisticWord).toBeInTheDocument();
    });
  });

  test("fetches user statistics and displays them", async () => {
    localStorage.setItem("username", "testUser");

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData),
    });

    renderComponentWithRouter();

    await waitFor(async () => {
      const table = await screen.findByRole("table");
      expect(table).toBeInTheDocument();
    });

    const columnHeaders = [
      "Partidas jugadas",
      "Puntos por partida",
      "Puntos totales",
      "Preguntas correctas totales",
      "Preguntas incorrectas totales",
      "Porcentaje de aciertos",
      "Tiempo por pregunta (s)",
    ];
    columnHeaders.forEach((headerText) => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== "username" && key!=="_id") {
        if (key === "avgPoints" || key === "avgTime") {
          expect(screen.getByText(value.toFixed(2))).toBeInTheDocument();
        } else if (key === "ratioCorrect") {
          expect(screen.getByText(value.toFixed(2) + "%")).toBeInTheDocument();
        }
      }
    });
  });

  test("displays an error message when fetching statistics fails", async () => {
    const userId = "testUser";
    localStorage.setItem("username", userId);

    global.fetch = jest.fn().mockRejectedValueOnce({
      json: jest.fn().mockRejectedValueOnce(userData),
    });

    renderComponentWithRouter();

    await waitFor(() => {
      screen.findByText("Error: Failed to fetch");
    });
  });

  test("updates user statistics when username changes", async () => {
    localStorage.setItem("username", "testUser");

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData),
    });

    renderComponentWithRouter();

    await screen.findByRole("table");

    const newUsername = "newUser";
    localStorage.setItem("username", newUsername);

    const searchButton = await screen.findByText("Buscar");
    userEvent.click(searchButton);

    renderComponentWithRouter();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(newUsername));
  });

  test("updates user statistics when game mode changes", async () => {
    localStorage.setItem("username", "testUser");

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData),
    });

    renderComponentWithRouter();
    await screen.findByRole("table");

    const modeButton = screen.getByRole("button", {
      name: /Batería de sabios/i,
    });
    userEvent.click(modeButton);

    await waitFor(() => {
      expect(screen.queryByText("WIQ")).toBeInTheDocument();
    });
  });

  test("fetches and displays user statistics for Human Calculator mode", async () => {
    localStorage.setItem("username", "testUser");

    userData.ratioCorrect = 0;
    userData.totalCorrectQuestions = 0;
    userData.totalIncorrectQuestions = 0;

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(userData),
    });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.queryByText("Cargando ...")).not.toBeInTheDocument();
    });
    
    screen.getByTestId("calculator-button").click();

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    const columnHeaders = [
      "Partidas jugadas",
      "Puntos por partida",
      "Puntos totales",
      "Preguntas correctas totales",
      "Preguntas incorrectas totales",
      "Porcentaje de aciertos",
      "Tiempo por pregunta (s)",
    ];

    columnHeaders.forEach((headerText) => {
      const headerElement = screen.getByText(headerText);
      expect(headerElement).toBeInTheDocument();
    });

    Object.entries(userData).forEach(([key, value]) => {
      if (key !== "username") {
        if (key === "avgPoints" || key === "avgTime") {
          const valueElements = screen.getAllByText(value.toFixed(2));
          expect(valueElements.length).toBeGreaterThan(0);
        } else {
          const valueElements = screen.getAllByText(value.toString());
          expect(valueElements.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test("displays a message when no stats are available", async () => {
    localStorage.setItem("username", "testUser");

    global.fetch = jest.fn().mockRejectedValueOnce({
      json: jest.fn().mockRejectedValueOnce(), // Simula que no hay estadísticas disponibles
    });

    renderComponentWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText("El usuario no ha jugado ninguna partida.")
      ).toBeInTheDocument();
    });
  });

  test("displays loading message while fetching stats", async () => {
    localStorage.setItem("username", "testUser");

    global.fetch = jest.fn().mockResolvedValueOnce(new Promise(() => {})); // Simula una promesa pendiente

    renderComponentWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Cargando ...")).toBeInTheDocument();
    });
  });
});
