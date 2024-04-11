import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import History from "./History";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.js";

describe("History Component", () => {
  test("renders user profile data after loading", async () => {
    const mockUserData = {
      username: "testUser",
      createdAt: new Date(),
      games: [
        {
          _id: "game1",
          questions: [
            {
              pregunta: "Question 1",
              respuestas: ["Answer 1", "Answer 2"],
              correcta: "Answer 1",
              respuesta: "Answer 2",
            },
            {
              pregunta: "Question 2",
              respuestas: ["Answer 3", "Answer 4"],
              correcta: "Answer 3",
              respuesta: "Answer 3",
            },
          ],
        },
      ],
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <History />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("testUser")).toBeInTheDocument();
      expect(
        screen.getByText(/Fecha de creación de la cuenta/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Question 1")).toBeInTheDocument();
      expect(screen.getByText("Question 2")).toBeInTheDocument();
      expect(screen.getByText("Answer 1")).toBeInTheDocument();
      expect(screen.getByText("Answer 2")).toBeInTheDocument();
      expect(screen.getByText("Answer 3")).toBeInTheDocument();
      expect(screen.getByText("Answer 4")).toBeInTheDocument();
    });
  });

  test("displays an error message when profile loading fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <History />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Ha habido un error al intentar cargar el perfil del usuario. Inténtalo más tarde")
      ).toBeInTheDocument();
    });
  });
});