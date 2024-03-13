import React, { useState } from "react";
import "./Config.css";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Config = () => {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [clasicoTime, setClasicoTime] = useState(
    localStorage.getItem("clasicoTime")
  );
  const [clasicoPreguntas, setClasicoPreguntas] = useState(
    localStorage.getItem("clasicoPreguntas")
  );
  const [bateriaTime, setBateriaTime] = useState(
    localStorage.getItem("bateriaTime")
  );

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
      localStorage.setItem("clasicoPreguntas", clasicoPreguntas);
      localStorage.setItem("bateriaTime", bateriaTime);

      alert("Cambios realizados satisfactoriamente");
    }
  };

  const handleClasicoChange = (event) => {
    setClasicoTime(parseInt(event.target.value));
  };

  const handleClasicoPreguntas = (event) => {
    setClasicoPreguntas(parseInt(event.target.value));
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
        <div>
          <label htmlFor="clasico"> Tiempo entre preguntas (Clásico)</label>
          <input
            id="clasico"
            value={clasicoTime}
            type="number"
            min="5"
            max="20"
            onChange={handleClasicoChange}
          />
          <label htmlFor="clasicoPreguntas">
            {" "}
            Número de preguntas (Clásico)
          </label>
          <input
            id="clasicoPreguntas"
            value={clasicoPreguntas}
            type="number"
            min="1"
            max="1000"
            onChange={handleClasicoPreguntas}
          />
          <label htmlFor="bateria">Tiempo total (Batería de sabios)</label>
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
