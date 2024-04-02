import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sobre from "./Sobre";

describe("Sobre component", () => {
  test("renders heading with team name", () => {
    render(
      <MemoryRouter>
        <Sobre />
      </MemoryRouter>
    );
    const headingElement = screen.getByRole("heading", { name: /Equipo WIQ_es1a/i });
    expect(headingElement).toBeInTheDocument();
  });

  test("renders table with designer information", () => {
    render(
      <MemoryRouter>
        <Sobre />
      </MemoryRouter>
    );

    const designerNames = ["Martín Cancio Barrera", "Iyán Fernández Riol", "Rodrigo García Iglesias"];
    designerNames.forEach(name => {
      const nameElement = screen.getByText(name);
      expect(nameElement).toBeInTheDocument();
    });

    const githubLinks = ["https://github.com/CANCI0", "https://github.com/iyanfdezz", "https://github.com/Rodrox11"];
    githubLinks.forEach(link => {
        const linkElements = screen.getAllByRole("link", { href: link });
        expect(linkElements.length).toBeGreaterThanOrEqual(1);
  });
  });
});

