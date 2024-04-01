import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Clasico from "./Clasico";
import { BrowserRouter as Router } from "react-router-dom";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("JuegoPreguntas Component", () => {
  test("renders game questions and handles user answers", async () => {
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

    render(
      <Router>
        <Clasico />
      </Router>
    );

    // Verificar que las preguntas se rendericen correctamente
    await waitFor(() => {
      expect(
        screen.getByText("¿Cuál es la capital de Francia?")
      ).toBeInTheDocument();
      expect(screen.getByText("Madrid")).toBeInTheDocument();
      expect(screen.getByText("París")).toBeInTheDocument();
      expect(screen.getByText("Berlín")).toBeInTheDocument();
      expect(screen.getByText("Londres")).toBeInTheDocument();
    });

    // Simular la selección de una respuesta
    fireEvent.click(screen.getByText("París"));

    // Verificar que la respuesta seleccionada se resalte correctamente
    expect(screen.getByText("París")).toHaveStyle('backgroundColor: "#10FF00"');

    // Simular el siguiente paso del juego
    fireEvent.click(screen.getByText("Responder"));
  });
});
