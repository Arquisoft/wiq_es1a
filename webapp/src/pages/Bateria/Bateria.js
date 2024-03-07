import React, { useState, useEffect } from "react";
import "./Bateria.css";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link, useNavigate } from "react-router-dom";

const JuegoPreguntas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(180);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8003/questions?tematica=all&n=10000")
      .then((response) => {
        if (!response.ok) {
          navigate("/home");
        }
        response.json();
      })
      .then((data) => {
        setPreguntas(data);
        setPreguntaActual(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las preguntas:", error);
        navigate("/home");
      });
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (tiempoRestante === 0 || indicePregunta === preguntas.length) {
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
    if (indicePregunta + 1 < preguntas.length) {
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
          <p>Tu puntuación: {puntuacion}</p>
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
      {isLoading ? (
        <span class="loader"></span>
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
          <div className="timer">Tiempo restante: {tiempoRestante}</div>
          <div className="points">Puntuación: {puntuacion}</div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default JuegoPreguntas;
