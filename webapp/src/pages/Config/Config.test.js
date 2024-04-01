import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Config from "./Config";
import { BrowserRouter as Router } from "react-router-dom";

beforeEach(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key],
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
});

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

  test("applies changes correctly", () => {
    render(
      <Router>
        <Config />
      </Router>
    );
  
    // Simular cambios en los valores de entrada
    const tiempoClasicoInput = screen.getByLabelText(
      "Tiempo entre preguntas (Clásico)"
    );
    fireEvent.change(tiempoClasicoInput, {
      target: { value: { toString: () => "20" } },
    });
  
    const numPreguntasClasicoInput = screen.getByLabelText(
      "Número de preguntas (Clásico)"
    );
    fireEvent.change(numPreguntasClasicoInput, {
      target: { value: { toString: () => "15" } },
    });
  
    const tiempoBateriaInput = screen.getByLabelText(
      "Tiempo total (Batería de sabios)"
    );
    fireEvent.change(tiempoBateriaInput, {
      target: { value: { toString: () => "300" } },
    });
  
    // Simular clic en el botón "Aplicar cambios"
    const applyChangesButton = screen.getByText("Aplicar cambios");
    fireEvent.click(applyChangesButton);
  
    // Verificar que los valores se hayan guardado en el almacenamiento local
    expect(localStorage.getItem("clasicoTime")).toEqual("20");
    expect(localStorage.getItem("clasicoPreguntas")).toEqual("15");
    expect(localStorage.getItem("bateriaTime")).toEqual("300");
  
    // Verificar que la alerta se muestre correctamente
    expect(window.alert).toHaveBeenCalledWith(
      "Cambios realizados satisfactoriamente"
    );
  });
  
});
