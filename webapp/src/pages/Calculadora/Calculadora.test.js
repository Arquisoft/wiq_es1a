import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalculadoraHumana from "./Calculadora";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

test("renders the game screen", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <CalculadoraHumana />
      </MemoryRouter>
    </I18nextProvider>
  );

  // Check if the game screen is rendered
  expect(screen.getByText(/(\d+)\s*([-+*/])\s*(\d+)/i)).toBeInTheDocument();
  expect(screen.getByTitle(/number/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  expect(screen.getByText(/tiempo restante/i)).toBeInTheDocument();
  expect(screen.getByText(/puntuación/i)).toBeInTheDocument();
});

test("handles correct answer", async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <CalculadoraHumana />
      </MemoryRouter>
    </I18nextProvider>
  );

  // Get the initial score
  const initialScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );

  // Get the initial operation
  var initialOperation = screen.getByText(
    /(\d+)\s*([-+*/])\s*(\d+)/
  ).textContent;
  initialOperation = initialOperation.split("=")[0];

  // Get the input field and submit button
  const inputField = screen.getByTitle(/number/i);
  const submitButton = screen.getByRole("button", { name: /enviar/i });

  // Enter the correct answer and submit
  fireEvent.change(inputField, { target: { value: eval(initialOperation) } });
  fireEvent.click(submitButton);

  // Check if the score has increased
  var updatedScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );
  expect(updatedScore).toBe(initialScore + 1);

  // Get next operation
  var nextOperation = screen.getByText(/(\d+)\s*([-+*/])\s*(\d+)/).textContent;
  nextOperation = nextOperation.split("=")[0];

  // Enter the correct answer and submit
  fireEvent.change(inputField, { target: { value: eval(nextOperation) } });
  fireEvent.keyDown(inputField, { key: "Enter", code: "Enter" });

  // Check if the score has increased
  updatedScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );
  expect(updatedScore).toBe(initialScore + 2);

  await setTimeout(() => {

  }, 1000);
});

test("handles incorrect answer", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <CalculadoraHumana />
      </MemoryRouter>
    </I18nextProvider>
  );

  // Get the initial score
  const initialScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );

  // Get the input field and submit button
  const inputField = screen.getByTitle(/number/i);
  const submitButton = screen.getByRole("button", { name: /enviar/i });

  // Enter an incorrect answer and submit
  fireEvent.change(inputField, { target: { value: "a" } });
  fireEvent.click(submitButton);

  // Check if the score remains the same
  const updatedScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );
  expect(updatedScore).toBe(initialScore);
});

test("handles game over", async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <CalculadoraHumana />
      </MemoryRouter>
    </I18nextProvider>
  );

  // Get the initial score
  const initialScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );
  
  // Get the input field and submit button
  const inputField = screen.getByTitle(/number/i);
  const submitButton = screen.getByRole("button", { name: /enviar/i });

  // Enter an incorrect answer and submit until game over
  while (!screen.queryByText(/juego terminado/i)) {
    fireEvent.change(inputField, { target: { value: 0 } });
    fireEvent.click(submitButton);
  }

  // Check if the game over screen is rendered
  expect(screen.getByText(/juego terminado/i)).toBeInTheDocument();
  expect(screen.getByText(/tu puntuación: (\d+)/i)).toBeInTheDocument();

  // Check if the score remains the same
  const updatedScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  ); 
  expect(updatedScore).toBe(initialScore);
  
  await setTimeout(() => {
    screen.getByText(/jugar de nuevo/i).click();
  }, 1000);
  
});
