import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";
import Nav from "./Nav";

test("renders Nav component", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Nav />
      </Router>
    </I18nextProvider>
  );

  const navElement = screen.getByRole("navigation");
  expect(navElement).toBeInTheDocument();
});

test("navigates to home page when home button is clicked", () => {
  const navigateMock = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigateMock,
  }));

  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Nav />
      </Router>
    </I18nextProvider>
  );

  const homeButton = screen.getByRole("button", { name: /home/i });
  fireEvent.click(homeButton);

  expect(navigateMock).toHaveBeenCalledWith("/home");
});

test("logs out when disconnect button is clicked", () => {
  const localStorageMock = {
    removeItem: jest.fn(),
  };
  global.localStorage = localStorageMock;

  const navigateMock = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigateMock,
  }));

  render(
    <I18nextProvider i18n={i18n}>
      <Router>
        <Nav />
      </Router>
    </I18nextProvider>
  );

  const disconnectButton = screen.getByRole("button", { name: /disconnect/i });
  fireEvent.click(disconnectButton);

  expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  expect(navigateMock).toHaveBeenCalledWith("/");
});
