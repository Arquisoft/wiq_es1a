import React, { useState, useEffect } from "react";
import "./Bateria.css";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link, useNavigate } from "react-router-dom";

const JuegoPreguntas = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000"
  const TIME = localStorage.getItem("bateriaTime");

  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIME);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [progressPercent, setProgressPercent] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(URL + "/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tematicas: localStorage.getItem("selectedThemes"), n: 9000 }),
    })
      .then((response) => {
        if (!response.ok) {
          navigate("/home?error=1");
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        setPreguntas(data);
        setPreguntaActual(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las preguntas:", error);
        navigate("/home?error=1");
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tiempoRestante === 0) {
      setJuegoTerminado(true);
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  useEffect(() => {
    setProgressPercent(tiempoRestante / TIME * 100);
  
    const timer = setInterval(() => {
      setTiempoRestante(prevTiempo => (prevTiempo <= 0 ? 0 : prevTiempo - 0.01));
    }, 10); 
  
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const handleSiguientePregunta = (respuesta) => {
    if (respuesta === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
    }
    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta + 1]);
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
      {juegoTerminado ? (
        <div className="menuContainer">
          <h2>¡Juego terminado!</h2>
          <p>Tu puntuación: {puntuacion}</p>
          <button onClick={handleRepetirJuego}>Repetir Juego</button>
          <Link to="/home">Volver al Menú Principal</Link>
        </div>
      ) : (
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
          <div className="timer">Tiempo restante: {Math.floor(tiempoRestante)}</div>
          <div className="points">Puntuación: {puntuacion}</div>
          <div className="progressBarContainer">
            <div
              className="progressBar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default JuegoPreguntas;
