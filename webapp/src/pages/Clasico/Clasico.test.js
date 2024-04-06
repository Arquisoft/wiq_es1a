import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Clasico from "./Clasico";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Clasico Component", () => {
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
      <MemoryRouter>
        <Clasico />
      </MemoryRouter>
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
    const button = screen.getByText("Responder");
    button.click();

    await waitFor(
      () => {
        expect(
          screen.getByText("¿Cuál es el río más largo del mundo?")
        ).toBeInTheDocument();
        expect(screen.getByText("Amazonas")).toBeInTheDocument();
        expect(screen.getByText("Nilo")).toBeInTheDocument();
        expect(screen.getByText("Misisipi")).toBeInTheDocument();
        expect(screen.getByText("Yangtsé")).toBeInTheDocument();
      },
      { timeout: 30000 }
    );

    // Simular la selección de una respuesta incorrecta
    fireEvent.click(screen.getByText("Nilo"));

    // Verificar que la respuesta seleccionada se resalte correctamente
    expect(screen.getByText("Amazonas")).toHaveStyle('backgroundColor: "#10FF00"');

    // Simular el siguiente paso del juego
    fireEvent.click(screen.getByText("Responder"));

    await waitFor(
      () => {
        expect(screen.getByText("¡Juego terminado!")).toBeInTheDocument();
        expect(screen.getByText("Repetir Juego")).toBeInTheDocument();
        expect(screen.getByText("Volver al Menú Principal")).toBeInTheDocument();
      },
      { timeout: 30000 }
    );

    fireEvent.click(screen.getByText("Repetir Juego"));
  }, 50000);

  test("renders game questions and handles errors", async () => {
    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "Failed to fetch" }),
      })
    );

    render(
      <MemoryRouter>
        <Clasico />
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      },
      { timeout: 30000 }
    );
  });
});
