import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Ranking from "./Ranking";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

const mockData = [
  { username: "user1", avgPoints: 50 },
  { username: "user2", avgPoints: 60 },
];

describe("Ranking component", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Ranking />
        </Router>
      </I18nextProvider>
    );
  };

  const assertRankingTableWithData = async () => {
    await waitFor(() => {
      expect(screen.getByText("Usuario")).toBeInTheDocument();
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
      expect(screen.getByText("60")).toBeInTheDocument();
    });
  };

  test("renders loading state initially", () => {
    renderComponent();
    expect(screen.getByText("Cargando ...")).toBeInTheDocument();
  });

  test("renders error message if fetching fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });
  });

  test("renders ranking table with data after successful fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    renderComponent();

    await assertRankingTableWithData();
  });

  test("changes gamemode when clicking on mode buttons", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    renderComponent();

    await assertRankingTableWithData();

    const bateriaButton = screen.getByRole("button", {
      name: "Batería de sabios",
    });
    fireEvent.click(bateriaButton);

    await waitFor(() => {
      expect(
        screen.getByText("Ranking - modo Batería de sabios")
      ).toBeInTheDocument();
    });
  });

  test('changes gamemode when clicking on mode buttons, clicks on Human Calculator button', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockData) });
  
    renderComponent();
  
    await assertRankingTableWithData();
  
    const calculatorButton = screen.getByRole('button', { name: 'Calculadora humana' });
    fireEvent.click(calculatorButton);
  
    await waitFor(() => {
      expect(screen.getByText('Ranking - modo Calculadora humana')).toBeInTheDocument();
      expect(screen.queryByText('Ratio de aciertos (%)')).toBeNull(); // Asegura que no se muestra la opción de filtrar por ratio de aciertos
    });
  });
});
