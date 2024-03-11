import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  // Definimos el estado para controlar el tema actual
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();

  // Función para alternar entre temas claro y oscuro
  const toggleTheme = () => {
    const root = document.getElementById("root");
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);
    setIsDarkTheme((prev) => !prev);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      <h1 className="logo">WIQ!</h1>
      <Link to="/home">Home</Link>
      <Link to="/sobre">Sobre nosotros</Link>
      <Link to="/stats">Stats</Link>
      <input
        type="checkbox"
        class="theme-toggle"
        onChange={toggleTheme}
        checked={isDarkTheme}
      />
      <button class="disconnect" onClick={() => Logout()}>
        Desconectarse
      </button>
    </nav>
  );
};

export default Nav;
