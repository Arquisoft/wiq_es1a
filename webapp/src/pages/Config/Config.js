import React, { useState } from "react";
import "./Config.css";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Config = () => {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [clasicoTime, setClasicoTime] = useState(10);
  const [bateriaTime, setBateriaTime] = useState(180);

  const handleConfig = () => {
    const checkboxes = document.querySelectorAll(
      '.topicCheckboxes input[type="checkbox"]'
    );
    const selectedThemes = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedThemes.push(checkbox.id);
      }
    });

    if (selectedThemes.length === 0) {
      alert("Debe haber al menos una temática seleccionada");
    } else {
      localStorage.setItem("selectedThemes", JSON.stringify(selectedThemes));
      localStorage.setItem("clasicoTime", clasicoTime);
      localStorage.setItem("bateriaTime", bateriaTime);

      alert("Cambios realizados satisfactoriamente");
    }
  };

  const handleClasicoChange = (event) => {
    setClasicoTime(parseInt(event.target.value));
  };

  const handleBateriaChange = (event) => {
    setBateriaTime(parseInt(event.target.value));
  };

  return (
    <>
      <Nav />
      <div className="configContainer">
        <h2>Configuración</h2>
        <h3>Temáticas de pregunta</h3>
        <div className="topicCheckboxes">
          <label htmlFor="paises"> Países</label>
          <input id="paises" type="checkbox" />

          <label htmlFor="literatura"> Literatura</label>
          <input id="literatura" type="checkbox" />

          <label htmlFor="cine"> Cine</label>
          <input id="cine" type="checkbox" />

          <label htmlFor="arte"> Arte</label>
          <input id="arte" type="checkbox" />

          <label htmlFor="programacion"> Programación</label>
          <input id="programacion" type="checkbox" />
        </div>
        <h3>Tiempo</h3>
        <div>
          <label htmlFor="clasico"> Clásico (entre preguntas)</label>
          <input
            id="clasico"
            value={clasicoTime}
            type="number"
            min="5"
            max="20"
            onChange={handleClasicoChange}
          />

          <label htmlFor="bateria"> Batería de sabios (Tiempo total)</label>
          <input
            id="bateria"
            value={bateriaTime}
            type="number"
            min="30"
            max="600"
            onChange={handleBateriaChange}
          />
        </div>
        <button onClick={handleConfig}>Aplicar cambios</button>
      </div>
      <Footer />
    </>
  );
};

export default Config;
