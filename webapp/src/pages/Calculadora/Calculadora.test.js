import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalculadoraHumana from "./Calculadora";
import { MemoryRouter } from "react-router-dom";

test("renders the game screen", () => {
  render(
    <MemoryRouter>
      <CalculadoraHumana />
    </MemoryRouter>
  );

  // Check if the game screen is rendered
  expect(screen.getByText(/¿/i)).toBeInTheDocument();
  expect(screen.getByTitle(/number/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  expect(screen.getByText(/tiempo restante/i)).toBeInTheDocument();
  expect(screen.getByText(/puntuación/i)).toBeInTheDocument();
});

test("handles correct answer", () => {
  render(
    <MemoryRouter>
      <CalculadoraHumana />
    </MemoryRouter>
  );

  // Get the initial score
  const initialScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );

  // Get the initial operation
  var initialOperation = screen.getByText(/(\d+)\s*([-+*/])\s*(\d+)/).textContent;
  initialOperation = initialOperation.substring(1, initialOperation.length - 1);

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
  nextOperation = nextOperation.substring(1, nextOperation.length - 1);

  // Enter the correct answer and submit
  fireEvent.change(inputField, { target: { value: eval(nextOperation) } });
  fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

  // Check if the score has increased
  updatedScore = parseInt(
    screen
      .getByText(/puntuación: (\d+)/i)
      .textContent.split(":")[1]
      .trim()
  );
  expect(updatedScore).toBe(initialScore + 2);
});

test("handles incorrect answer", () => {
  render(
    <MemoryRouter>
      <CalculadoraHumana />
    </MemoryRouter>
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
  fireEvent.change(inputField, { target: { value: 0 } });
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

test("handles game over", () => {
  render(
    <MemoryRouter>
      <CalculadoraHumana />
    </MemoryRouter>
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

  screen.getByText(/repetir juego/i).click();

  waitFor(() => {
    expect(screen.getByText(/¿/i)).toBeInTheDocument();
  });
});
