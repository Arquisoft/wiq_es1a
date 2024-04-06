import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sobre from "./Sobre";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe("Sobre component", () => {
  test("renders heading with team name", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Sobre />
        </MemoryRouter>
      </I18nextProvider>
    );
    const headingElement = screen.getByRole("heading", {
      name: /Equipo WIQ_es1a/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  test("renders table with designer information", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Sobre />
        </MemoryRouter>
      </I18nextProvider>
    );

    const designerNames = [
      "Martín Cancio Barrera",
      "Iyán Fernández Riol",
      "Rodrigo García Iglesias",
    ];
    designerNames.forEach((name) => {
      const nameElement = screen.getByText(name);
      expect(nameElement).toBeInTheDocument();
    });

    const githubLinks = [
      "https://github.com/CANCI0",
      "https://github.com/iyanfdezz",
      "https://github.com/Rodrox11",
    ];
    githubLinks.forEach((link) => {
      const linkElements = screen.getAllByRole("link", { href: link });
      expect(linkElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
