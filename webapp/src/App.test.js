import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Nav from "./components/Nav/Nav.js";
import Footer from "./components/Footer/Footer.js";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";


describe("App Component", () => {

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
      writable: true,
    });
  });

  test("renders login page by default", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );

    const loginPage = screen.getByText("Login");
    expect(loginPage).toBeInTheDocument();
  });
});

describe("Home Component", () => {
  test("renders welcome message and game links", () => {
    const { getByText, getByRole } = render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Home />
        </Router>
      </I18nextProvider>
    );

    // Verifica que el mensaje de bienvenida esté presente
    expect(getByText("¡Bienvenido a WIQ!")).toBeInTheDocument();
    expect(getByText("Elige el modo de juego")).toBeInTheDocument();

    // Verifica el texto de cada enlace
    expect(getByRole("button", { name: "Clásico" })).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Batería de sabios" })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Calculadora humana" })
    ).toBeInTheDocument();
  });
});

describe("Nav Component", () => {

  const renderNav= () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Nav />
        </Router>
      </I18nextProvider>
    );
  };

  test("renders Nav component with links and logout button", async () => {
    renderNav();

    // Verificar que el logo esté presente
    expect(screen.getByText("WIQ")).toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Estadísticas")).toBeInTheDocument();
    expect(screen.getByText("Ranking")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Sobre nosotros")).toBeInTheDocument();
    expect(screen.getByText("Opciones")).toBeInTheDocument();
    expect(screen.getByText("Clásico")).toBeInTheDocument();
    expect(screen.getByText("Batería de sabios")).toBeInTheDocument();
    expect(screen.getByText("Calculadora humana")).toBeInTheDocument();
    const socialLinks = screen.queryAllByText("Social");
    expect(socialLinks.length).toBe(2);
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Amigos")).toBeInTheDocument();

    // Verificar que el botón de logout esté presente y que sea un enlace al login
    const logoutButton = screen.getByText("testuser");
    expect(logoutButton).toBeInTheDocument();
    //expect(logoutButton.closest('a')).toHaveAttribute('href', '/login');
  });

  test("calls localStorage.removeItem when logout button is clicked", async () => {
    const removeItemMock = jest.fn();
    Object.defineProperty(window, "localStorage", {
      value: { removeItem: removeItemMock },
      writable: true,
    });

    renderNav();

    const logoutButton = screen.getByText("testuser");
    fireEvent.click(logoutButton);
  });

  test("navigates to /home when Home button is clicked", () => {
    renderNav();

    const homeButton = screen.getByText("Inicio");
    fireEvent.click(homeButton);

    expect(window.location.pathname).toBe("/home");
  });

  test("navigates to /stats when Estadísticas button is clicked", () => {
    renderNav();

    const statsButton = screen.getByText("Estadísticas");
    fireEvent.click(statsButton);

    expect(window.location.pathname).toBe("/stats");
  });

  test("navigates to /ranking when Ranking button is clicked", () => {
    renderNav();

    const rankingButton = screen.getByText("Ranking");
    fireEvent.click(rankingButton);

    expect(window.location.pathname).toBe("/ranking");
  });

  test("navigates to /perfil when Perfil button is clicked", () => {
    renderNav();

    const perfilButton = screen.getByText("Mi perfil");
    fireEvent.click(perfilButton);

    expect(window.location.pathname).toBe("/perfil");
  });

  test("navigates to /sobre when Sobre nosotros button is clicked", () => {
    renderNav();

    const aboutButton = screen.getByText("Sobre nosotros");
    fireEvent.click(aboutButton);

    expect(window.location.pathname).toBe("/sobre");
  });

  test("navigates to /config when Opciones button is clicked", () => {
    renderNav();

    const optionsButton = screen.getByText("Opciones");
    fireEvent.click(optionsButton);

    expect(window.location.pathname).toBe("/config");
  });

  test("navigates to popover options", () => {
    renderNav();

    fireEvent.click(screen.getByTestId("classic"));
    expect(window.location.pathname).toBe("/home/clasico");

    fireEvent.click(screen.getByTestId("battery"));
    expect(window.location.pathname).toBe("/home/bateria");

    fireEvent.click(screen.getByTestId("calculator"));
    expect(window.location.pathname).toBe("/home/calculadora");

    fireEvent.click(screen.getByTestId("users"));
    expect(window.location.pathname).toBe("/social/usuarios");

    fireEvent.click(screen.getByTestId("friends"));
    expect(window.location.pathname).toBe("/social/amigos");

    fireEvent.click(screen.getByTestId("groups"));
    expect(window.location.pathname).toBe("/social/grupos");

    fireEvent.click(screen.getByTestId("mygroups"));
    expect(window.location.pathname).toBe("/social/misgrupos");
  });

});
describe("Footer Component", () => {
  it("renders footer text correctly", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );

    // Verificar que el texto del pie de página esté presente
    expect(screen.getByText("WIQ!")).toBeInTheDocument();
    expect(
      screen.getByText("Copyright 2024 ® Grupo 1A de Arquitectura del Software")
    ).toBeInTheDocument();
  });
});
