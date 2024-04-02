import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Register from "./Register";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");

describe("Register Component", () => {
  const mockSuccessResponse = { data: "Usuario registrado exitosamente" };
  const mockErrorResponse = { response: { data: { error: "Error al registrar usuario" } } };

  const fillRegistrationForm = () => {
    fireEvent.change(screen.getByLabelText("Introduce tu nombre:"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText("Introduce tu contraseña:"), {
      target: { value: "testPassword" },
    });
    fireEvent.change(screen.getByLabelText("Vuelve a introducir la contraseña:"), {
      target: { value: "testPassword" },
    });
  };

  const submitRegistrationForm = async () => {
    fireEvent.click(screen.getByText("Registrarse"));
    await waitFor(() => {});
  };

  test("renders registration form correctly", () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByText("Regístrate")).toBeInTheDocument();
    expect(screen.getByLabelText("Introduce tu nombre:")).toBeInTheDocument();
    expect(screen.getByLabelText("Introduce tu contraseña:")).toBeInTheDocument();
    expect(screen.getByLabelText("Vuelve a introducir la contraseña:")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
    expect(screen.getByText("¿Ya tienes cuenta?")).toBeInTheDocument();
  });

  test("handles user registration successfully", async () => {
    axios.post.mockResolvedValueOnce(mockSuccessResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    fillRegistrationForm();
    await submitRegistrationForm();

    expect(screen.getByText("Usuario registrado exitosamente")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/adduser", {
      username: "testUser",
      password: "testPassword",
    });
  });

  test("handles user registration failure", async () => {
    axios.post.mockRejectedValueOnce(mockErrorResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    fillRegistrationForm();
    await submitRegistrationForm();

    expect(screen.getByText("Error: Error al registrar usuario")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/adduser", {
      username: "testUser",
      password: "testPassword",
    });
  });
});
