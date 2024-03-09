import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  // Definimos el estado para controlar el tema actual
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Función para alternar entre temas claro y oscuro
  const toggleTheme = () => {
    const root = document.getElementById('root');
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);
  };

  return (
    <nav>
      <div className="slider-container">
        <label className="switch">
          <input
            type="checkbox"
            id="theme-toggle"
            onChange={toggleTheme}
            checked={isDarkTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <h1 className="logo">WIQ!</h1>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/sobre">Sobre nosotros</Link>
        </li>
        <li>
          <Link to="/stats">Stats</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
