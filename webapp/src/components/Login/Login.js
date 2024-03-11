// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  //const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const loginUser = async () => {
    await axios
      .post(`${apiEndpoint}/login`, { username, password })
      .then((response) => {
        const token = response.data;

        setLoginSuccess(true);

        setOpenSnackbar(true);
        localStorage.setItem("token", token);

        localStorage.setItem("username", username);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="login-container">
      {loginSuccess ? (
        navigate("/home")
      ) : (
        <>
          <h1 className="login-header">Identifícate</h1>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={loginUser}>
            Login
          </button>
          {openSnackbar && (
            <div className="login-snackbar">Login successful</div>
          )}
          {error && <div className="login-error">Error: {error}</div>}
        </>
      )}
    </div>
  );
};

export default Login;
