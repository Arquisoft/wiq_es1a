import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Register from "./Register";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");

describe("Register Component", () => {
  test("renders registration form correctly", () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // Verificar que los elementos del formulario se rendericen correctamente
    expect(screen.getByText("Regístrate")).toBeInTheDocument();
    expect(screen.getByLabelText("Introduce tu nombre:")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Introduce tu contraseña:")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Vuelve a introducir la contraseña:")
    ).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
    expect(screen.getByText("¿Ya tienes cuenta?")).toBeInTheDocument();
  });

  test("handles user registration successfully", async () => {
    const mockSuccessResponse = { data: "Usuario registrado exitosamente" };
    axios.post.mockResolvedValueOnce(mockSuccessResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    // Simular la entrada de datos del usuario
    fireEvent.change(screen.getByLabelText("Introduce tu nombre:"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText("Introduce tu contraseña:"), {
      target: { value: "testPassword" },
    });
    fireEvent.change(
      screen.getByLabelText("Vuelve a introducir la contraseña:"),
      {
        target: { value: "testPassword" },
      }
    );

    // Simular clic en el botón de registro
    fireEvent.click(screen.getByText("Registrarse"));

    // Esperar a que se complete la solicitud y se muestre la confirmación
    await waitFor(() => {
      expect(
        screen.getByText("Usuario registrado exitosamente")
      ).toBeInTheDocument();
    });

    // Verificar que se haya llamado correctamente a la función post de axios
    expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/adduser", {
      username: "testUser",
      password: "testPassword",
    });
  });

  test("handles user registration failure", async () => {
    const errorMessage = "Error al registrar usuario";
    const mockErrorResponse = { response: { data: { error: errorMessage } } };
    axios.post.mockRejectedValueOnce(mockErrorResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    // Simular la entrada de datos del usuario
    fireEvent.change(screen.getByLabelText("Introduce tu nombre:"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText("Introduce tu contraseña:"), {
      target: { value: "testPassword" },
    });
    fireEvent.change(
      screen.getByLabelText("Vuelve a introducir la contraseña:"),
      {
        target: { value: "testPassword" },
      }
    );

    // Simular clic en el botón de registro
    fireEvent.click(screen.getByText("Registrarse"));

    // Esperar a que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    // Verificar que se haya llamado correctamente a la función post de axios
    expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/adduser", {
      username: "testUser",
      password: "testPassword",
    });
  });
});
