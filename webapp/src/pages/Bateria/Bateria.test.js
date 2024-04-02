import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Bateria from "./Bateria";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios", () => ({
  post: jest.fn((url) => {
    if (url === "/saveGame") {
      return Promise.resolve({ data: "Game saved successfully" });
    } else if (url === "/saveGameList") {
      return Promise.resolve({ data: "Game list saved successfully" });
    }
  }),
}));

describe("Bateria Component", () => {
  beforeEach(() => {
    const mockQuestions = [
      {
        pregunta: "¿Cuál es la capital de Francia?",
        respuestas: ["Madrid", "París", "Berlín", "Londres"],
        correcta: "París",
      },
      {
        pregunta: "¿Cuál es el río más largo del mundo?",
        respuestas: ["Amazonas", "Nilo", "Misisipi", "Yangtsé"],
        correcta: "Amazonas",
      },
    ];

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockQuestions),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test("renders game questions correctly", async () => {
    render(
      <Router>
        <Bateria />
      </Router>
    );

    // Verificar que el spinner de carga se muestra inicialmente
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Esperar a que las preguntas se carguen
    await waitFor(() => {
      // Verificar que las preguntas se muestran correctamente después de la carga
      expect(
        screen.getByText("¿Cuál es la capital de Francia?")
      ).toBeInTheDocument();
      expect(screen.getByText("Madrid")).toBeInTheDocument();
      expect(screen.getByText("París")).toBeInTheDocument();
      expect(screen.getByText("Londres")).toBeInTheDocument();
      expect(screen.getByText("Berlín")).toBeInTheDocument();
    });
  });

  test("handles answering questions correctly", async () => {
    render(
      <Router>
        <Bateria />
      </Router>
    );

    // Esperar a que las preguntas se carguen
    await waitFor(() => {
      expect(
        screen.getByText("¿Cuál es la capital de Francia?")
      ).toBeInTheDocument();
    });

    // Simular responder la pregunta correctamente
    fireEvent.click(screen.getByText("París"));

    // Esperar a que se termine el juego
    await waitFor(() => {
      expect(screen.getByText("¡Juego terminado!")).toBeInTheDocument();
      expect(screen.getByText("Tu puntuación: 1")).toBeInTheDocument();
      expect(screen.getByText("Repetir Juego")).toBeInTheDocument();
      expect(screen.getByText("Volver al Menú Principal")).toBeInTheDocument();
    });
  });
});
