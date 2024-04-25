import React from "react";
import { render, screen } from "@testing-library/react";
import WrongRoute from "./WrongRoute";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

test("renders 404 message", () => {
  const { getByText, getByRole } = render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <WrongRoute />
      </Router>
    </I18nextProvider>
  );

  expect(getByText("404")).toBeInTheDocument();
  expect(getByText("Página no encontrada")).toBeInTheDocument();
  expect(
    getByText("La página que estabas buscando no está disponible")
  ).toBeInTheDocument();

  expect(getByRole("link")).toBeInTheDocument();
});

test('renders "Página no encontrada" message', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <WrongRoute />
      </Router>
    </I18nextProvider>
  );
  const notFoundMessage = screen.getByText(/Página no encontrada/i);
  expect(notFoundMessage).toBeInTheDocument();
});

test("renders link to home page", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <WrongRoute />
      </Router>
    </I18nextProvider>
  );
  const homeLink = screen.getByRole("link", { name: /Volver al inicio/i });
  expect(homeLink).toHaveAttribute("href", "/home");
});
