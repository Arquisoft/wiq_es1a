import React, { useState, useEffect } from 'react';
import '../css/JuegoPreguntas.css';
import Preguntas from '../components/Preguntas';
import { useNavigate  } from 'react-router-dom';

const JuegoPreguntas = () => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false); // Estado para mostrar el menú al finalizar el juego
  const preguntaActual = Preguntas[indicePregunta];
  const navigate = useNavigate();

  useEffect(() => {
    if (tiempoRestante === 0) {
      setTimeout(() => {
        handleSiguientePregunta();
      }, 3000);
    }
    const timer = setInterval(() => {
      setTiempoRestante(prevTiempo => prevTiempo <= 0 ? 0 : prevTiempo - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante, indicePregunta]);

  useEffect(() => {
    if (juegoTerminado) {
      // Detener el juego y mostrar el menú al finalizar el juego
      setMostrarMenu(true);
    }
  }, [juegoTerminado]);

  const handleRespuestaSeleccionada = (respuesta) => {
    if (!juegoTerminado) {
      setRespuestaSeleccionada(respuesta);
    }
  };

  const estiloRespuesta = (respuesta) => {
    if (juegoTerminado) {
      if (respuesta === preguntaActual.respuestaCorrecta) {
        return { backgroundColor: 'green' };
      } else if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: 'red' };
      }
    } else {
      if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: 'orange' };
      }
    }
    return {};
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.respuestaCorrecta) {
      setPuntuacion(puntuacion + 1);
    }
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
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
    setTiempoRestante(10);
    setJuegoTerminado(false);
    setMostrarMenu(false);
  };

  const handleVolverAlMenu = () => {
    navigate('../home');
  };

  if (mostrarMenu) {
    return (
      <div className="menuContainer">
        <h2>¡Juego terminado!</h2>
        <p>Tu puntuación: {puntuacion}/{Preguntas.length}</p>
        <button onClick={handleRepetirJuego}>Repetir Juego</button>
        <button onClick={handleVolverAlMenu}>Volver al Menú Principal</button>
      </div>
    );
  }

  return (
    <div className="questionContainer">
      <h2>Pregunta {indicePregunta + 1}:</h2>
      <p>{preguntaActual.pregunta}</p>
      <div className="responsesContainer">
        {preguntaActual.respuestas.map((respuesta, index) => (
          <button
            key={index}
            onClick={() => handleRespuestaSeleccionada(respuesta)}
            disabled={tiempoRestante === 0 || juegoTerminado}
            style={estiloRespuesta(respuesta)}
          >
            {respuesta}
          </button>
        ))}
      </div>
      <div className="timer">Tiempo restante: {tiempoRestante}</div>
      <div className="points">Puntuación: {puntuacion}</div>
    </div>
  );
};

export default JuegoPreguntas;
