import React, { useState, useEffect } from "react";
import "./Bateria.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from "../../components/Footer/Footer.js";
import Preguntas from "./prueba";

const JuegoPreguntas = () => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(180);
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

  const handleRespuestaSeleccionada = (respuesta) => {
    if (!juegoTerminado) {
      setRespuestaSeleccionada(respuesta);
      handleSiguientePregunta();
    }
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
    }
    setRespuestaSeleccionada(null);
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
    setRespuestaSeleccionada(null);
    setTiempoRestante(60);
    setJuegoTerminado(false);
  };

  return (
    <>
      <Nav />
      <div className="questionContainer">
        {juegoTerminado ? (
          <div className="menuContainer">
            <h2>¡Juego terminado!</h2>
            <p>
              Tu puntuación: {puntuacion}/{Preguntas.length}
            </p>
            <button onClick={handleRepetirJuego}>Repetir Juego</button>
          </div>
        ) : (
          <>
            <h2>Pregunta {indicePregunta + 1}:</h2>
            <p>{preguntaActual.pregunta}</p>
            <div className="responsesContainer">
              {preguntaActual.respuestas.map((respuesta, index) => (
                <button
                  key={index}
                  onClick={() => handleRespuestaSeleccionada(respuesta)}
                >
                  {respuesta}
                </button>
              ))}
            </div>
            <div className="timer">Tiempo restante: {tiempoRestante}</div>
            <div className="points">Puntuación: {puntuacion}</div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JuegoPreguntas;
