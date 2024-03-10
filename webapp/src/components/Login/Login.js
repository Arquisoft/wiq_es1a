// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import {useNavigate} from "react-router-dom";
import './Login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });
      console.log(response);
      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;
      const { token: token } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

      setOpenSnackbar(true);
      localStorage.setItem('token', token);

      localStorage.setItem('username', username);

    } catch (error) {
      //console.log(error);
      //setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="login-container">
      {loginSuccess ? (
        navigate("/home")
      ) : (
        <>
          <h1 className="login-header">Login</h1>
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
            <div className="login-snackbar">
              Login successful
            </div>
          )}
          {error && (
            <div className="login-error">
              Error: {error}
            </div>
          )}
        </>
      )}
      </div>
    )
}  

export default Login;
