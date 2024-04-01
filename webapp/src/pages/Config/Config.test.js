import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Config from "./Config";
import { BrowserRouter as Router } from "react-router-dom";

describe("Config Component", () => {
  test("renders correctly with default values", () => {
    render(
      <Router>
        <Config />
      </Router>
    );

    // Verificar que los elementos del formulario se rendericen correctamente
    expect(screen.getByText("Configuración")).toBeInTheDocument();
    expect(screen.getByText("Temáticas de preguntas")).toBeInTheDocument();
    expect(screen.getByLabelText("Países")).toBeInTheDocument();
    expect(screen.getByLabelText("Literatura")).toBeInTheDocument();
    expect(screen.getByLabelText("Cine")).toBeInTheDocument();
    expect(screen.getByLabelText("Arte")).toBeInTheDocument();
    expect(screen.getByLabelText("Programación")).toBeInTheDocument();
    expect(
      screen.getByText("Tiempo entre preguntas (Clásico)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Número de preguntas (Clásico)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tiempo total (Batería de sabios)")
    ).toBeInTheDocument();
    expect(screen.getByText("Aplicar cambios")).toBeInTheDocument();
  });
  
});
