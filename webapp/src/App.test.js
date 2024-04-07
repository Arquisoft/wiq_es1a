import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Nav from "./components/Nav/Nav.js";
import Footer from "./components/Footer/Footer.js";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";

describe("App Component", () => {
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
    expect(getByRole("button", { name: "Batería de sabios" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Calculadora humana" })).toBeInTheDocument();
  });
});

describe("Nav Component", () => {
  it("renders Nav component with links and logout button", () => {
    const { getByText, getByRole } = render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Nav />
        </Router>
      </I18nextProvider>
    );

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
    const logoutButton = getByRole("button", { name: /Desconectar/i });
    expect(logoutButton).toBeInTheDocument();
    //expect(logoutButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it("calls localStorage.removeItem when logout button is clicked", () => {
    // Mock de localStorage.removeItem
    const removeItemMock = jest.fn();
    Object.defineProperty(window, "localStorage", {
      value: { removeItem: removeItemMock },
      writable: true,
    });

    // Renderizar el componente Nav
    const { getByRole } = render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Nav />
        </Router>
      </I18nextProvider>
    );
    const logoutButton = getByRole("button", { name: /Desconectar/i });

    // Simular clic en el botón de logout
    fireEvent.click(logoutButton);

    // Verificar que la función removeItem se haya llamado con 'token'
    expect(removeItemMock).toHaveBeenCalledWith("token");
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
