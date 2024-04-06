import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

test("renders welcome message", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Home />
      </Router>
    </I18nextProvider>
  );
  const welcomeElement = screen.getByText(/Bienvenido/i);
  expect(welcomeElement).toBeInTheDocument();
});

test("renders game modes", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Home />
      </Router>
    </I18nextProvider>
  );

  expect(screen.getByRole("button", { name: "Clásico" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Batería de sabios" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Calculadora humana" })
  ).toBeInTheDocument();
});
