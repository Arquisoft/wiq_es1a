import React, { useState, useEffect } from "react";
import "./Clasico.css";
import { useNavigate } from "react-router-dom";
import Nav from '../../components/Nav/Nav.js';
import { Link } from 'react-router-dom';
import Footer from "../../components/Footer/Footer.js";
import axios from 'axios';

const JuegoPreguntas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false); // Estado para mostrar el menú al finalizar el juego
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8003/questions?tematica=all&n=10")
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
        //setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las preguntas:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (preguntas && preguntas.length > 0) {
      setPreguntaActual(preguntas[0]);
      setIsLoading(false);
    }
  }, [preguntas]);

  useEffect(() => {
    if (tiempoRestante === 0) {
      setTimeout(() => {
        handleSiguientePregunta();
      }, 3000);
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante, indicePregunta]);

  useEffect(() => {
    if (juegoTerminado) {
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
        return { backgroundColor: "green" };
      } else if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: "red" };
      }
    } else {
      if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: "#0F0F0F", color: "#F0F0F0" };
      }
    }
    return {};
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
    }
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta]);
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

  if (mostrarMenu) {
    return (
      <>
        <Nav />
        <div className="menuContainer">
          <h2>¡Juego terminado!</h2>
          <p>
            Tu puntuación: {puntuacion}/{preguntas.length}
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
      {isLoading? 
      <span class="loader"></span>
      : 
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
      </div> }
      <Footer />
    </>
  );
};

export default JuegoPreguntas;
