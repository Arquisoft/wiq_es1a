import React, { useState, useEffect } from "react";
import "./Bateria.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from "../../components/Footer/Footer.js";
import Preguntas from "./prueba";
import { Link } from 'react-router-dom';

const JuegoPreguntas = () => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const preguntaActual = Preguntas[indicePregunta];

  useEffect(() => {
    if (tiempoRestante === 0 || indicePregunta === Preguntas.length) {
      setJuegoTerminado(true);
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const handleSiguientePregunta = (respuesta) => {
    if (respuesta === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
    }
    if (indicePregunta + 1 < Preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
    } else {
      setJuegoTerminado(true);
    }
  };

  const handleRepetirJuego = () => {
    // Reiniciar el estado para repetir el juego
    setIndicePregunta(0);
    setPuntuacion(0);
    setTiempoRestante(180);
    setJuegoTerminado(false);
  };

  if (juegoTerminado) {
    return (
      <>
        <Nav />
        <div className="menuContainer">
          <h2>¡Juego terminado!</h2>
          <p>
            Tu puntuación: {puntuacion}
          </p>
          <button onClick={handleRepetirJuego}>Repetir Juego</button>
          <Link to="/home">Volver al Menú Principal</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="questionContainer">
            <h2>Pregunta {indicePregunta + 1}:</h2>
            <p>{preguntaActual.pregunta}</p>
            <div className="responsesContainer">
              {preguntaActual.respuestas.map((respuesta, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSiguientePregunta(respuesta);
                  }}
                >
                  {respuesta}
                </button>
              ))}
            </div>
            <div className="timer">Tiempo restante: {tiempoRestante}</div>
            <div className="points">Puntuación: {puntuacion}</div>
          </div>
      <Footer />
    </>
  );
};

export default JuegoPreguntas;