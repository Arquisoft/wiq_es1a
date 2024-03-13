import React, { useState, useEffect } from "react";
import "./Descubriendo.css";
import Nav from "../../components/Nav/Nav.js";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.js";

const Descubriendo = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const [country, setCountry] = useState("");
  const [hints, setHints] = useState([]);
  const [actualHint, setActualHint] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarMenu, setMostrarMenu] = useState("");
  const [response, setResponse] = useState("");
  const [repetirJuego, setRepetirJuego] = useState(false);

  useEffect(() => {
    const sparqlQuery = `
      SELECT DISTINCT ?countryLabel ?population ?languageLabel ?capitalLabel ?jefeLabel ?pibLabel ?fronteraLabel
      WHERE {
        ?country wdt:P31 wd:Q6256.
          ?country wdt:P1082 ?population.
          ?country wdt:P37 ?language.
          ?country wdt:P36 ?capital.
          ?country wdt:P6 ?jefe.
          ?country wdt:P2132 ?pib.
          ?country wdt:P47 ?frontera.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" }
      }
      ORDER BY UUID()
      LIMIT 1
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}&format=json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json(); // Si la respuesta es JSON
      })
      .then((data) => {
        const questionBodies = [
          "Su población es de ",
          "Uno de sus idiomas oficiales es el ",
          "Su capital es ",
          "Su jefe de gobierno es ",
          "Su PIB per cápita (en USD $M) es ",
          "Comparte frontera con ",
        ];

        const props = Object.values(data.results.bindings[0]).map(
          (x) => x.value
        );
        setCountry(props[0]);
        props.shift();

        const hints = [];
        for (let i = 1; i < questionBodies.length; i++) {
          hints.push(questionBodies[i] + props[i]);
        }
        setHints(hints);
        setActualHint(hints[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: " + error.message);
      });
    // eslint-disable-next-line
  }, [repetirJuego]);

  const handleSubmit = () => {
    if (response === country) {
      setMostrarMenu("¡Has acertado el país!");
    } else if (hintIndex < hints.length) {
      setHintIndex((prev) => prev + 1);
      setActualHint(hints[hintIndex + 1]);
    } else {
      setMostrarMenu("No has conseguido acertar el país");
    }
  };

  const handleRepetirJuego = () => {
    setMostrarMenu(null);
    setHintIndex(0);
    setIsLoading(true);
    setRepetirJuego((prev) => !prev);
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <span class="loader"></span>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      {mostrarMenu ? (
        <div className="menuContainer">
          <h2>¡Has acertado el país!</h2>
          <button onClick={handleRepetirJuego}>Repetir Juego</button>
          <Link to="/home">Volver al Menú Principal</Link>
        </div>
      ) : (
        <div className="hintContainer">
          <h2>Pista {hintIndex + 1}:</h2>
          <p>{actualHint}</p>
          <input
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Escribe tu respuesta"
          />
          <input type="button" value="Enviar respuesta" onClick={handleSubmit}></input>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Descubriendo;
