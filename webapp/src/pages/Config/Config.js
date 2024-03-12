import { React, useState } from "react";
import "./Config.css";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Config = () => {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

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
      console.log(JSON.stringify(selectedThemes));

      alert("Cambios realizados satisfactoriamente");
    }
  };

  return (
    <>
      <Nav />
      <div class="configContainer">
        <h2>Configuración</h2>
        <div>
          <h3>Temáticas de pregunta</h3>
          <div class="topicCheckboxes">
            <label for="paises"> Países</label>
            <input id="paises" type="checkbox" />

            <label for="literatura"> Literatura</label>
            <input id="literatura" type="checkbox" />

            <label for="cine"> Cine</label>
            <input id="cine" type="checkbox" />

            <label for="arte"> Arte</label>
            <input id="arte" type="checkbox" />

            <label for="programacion"> Programación</label>
            <input id="programacion" type="checkbox" />
          </div>
        </div>
        <button onClick={() => handleConfig()}>Aplicar cambios</button>
      </div>
      <Footer />
    </>
  );
};

export default Config;
