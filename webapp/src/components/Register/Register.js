import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleRegister = () => {
    if (password !== passwordR) {
      setError("Las contraseñas no coinciden");
      return;
    }
    axios
      .post(`${apiEndpoint}/adduser`, { username, password })
      .then(() => setOpenSnackbar(true))
      .catch((error) => setError(error.message));
  };

  return (
    <div className="register-container">
      <h1 className="register-header">Regístrate</h1>
      <label for="register-username">Introduce tu nombre:</label>
      <input
        id="register-username"
        className="register-input"
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label for="register-password">Introduce tu contraseña:</label>
      <input
        className="register-password"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label for="register-pass2">Vuelve a introducir la contraseña:</label>
      <input
        className="register-pass2"
        type="password"
        placeholder="Repetir contraseña"
        value={passwordR}
        onChange={(e) => setPasswordR(e.target.value)}
      />
      <button className="register-button" onClick={handleRegister}>
        Registrarse
      </button>
      {openSnackbar && (
        <div className="register-snackbar">Usuario registrado exitosamente</div>
      )}
      {error && <div className="login-error">Error: {error}</div>}
    </div>
  );
};

export default AddUser;
