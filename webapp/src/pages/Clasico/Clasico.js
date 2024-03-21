import React, { useState, useEffect, useMemo } from "react";
import "./Clasico.css";
import Nav from "../../components/Nav/Nav.js";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.js";
import axios from 'axios';

const JuegoPreguntas = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const SECS_PER_QUESTION = useMemo(() => localStorage.getItem("clasicoTime"));

  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(SECS_PER_QUESTION);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntaTerminada, setPreguntaTerminada] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false); // Estado para mostrar el menú al finalizar el juego
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState("");
  const [progressPercent, setProgressPercent] = useState(100);
  const navigate = useNavigate();

  //Used for user stats
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [preguntasFalladas, setPreguntasFalladas] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [tiempoMedio, setTiempoMedio] = useState(0);

  useEffect(() => {
    fetch(URL + "/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tematicas: localStorage.getItem("selectedThemes"), n: localStorage.getItem("clasicoPreguntas") })
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
    const roundedProgressPercent = ((tiempoRestante / SECS_PER_QUESTION) * 100).toFixed(2);
    setProgressPercent(roundedProgressPercent);

    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) =>
        prevTiempo <= 0 ? 0 : prevTiempo - 0.01
      );
    }, 10);

    return () => clearInterval(timer);
  }, [tiempoRestante]);

  useEffect(() => {
    if (tiempoRestante === 0) {
      setPreguntaTerminada(true);
      setTimeout(() => {
        setPreguntaTerminada(false);
        handleSiguientePregunta();
      }, 3000);
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [tiempoRestante]);

  useEffect(() => {
    if (juegoTerminado) {
      setMostrarMenu(true);
    }
    // eslint-disable-next-line
  }, [juegoTerminado]);

  const handleRespuestaSeleccionada = (respuesta) => {
    if (!juegoTerminado) {
      setRespuestaSeleccionada(respuesta);
    }
  };

  const estiloRespuesta = (respuesta) => {
    if (preguntaTerminada) {
      if (respuesta === preguntaActual.correcta) {
        return { backgroundColor: "#10FF00" };
      } else if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: "red" };
      }
    } else {
      if (respuesta === respuestaSeleccionada) {
        return { backgroundColor: "var(--text)", color: "var(--background)" };
      }
    }
    return {};
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(preguntasCorrectas + 1);
    } else {
      setPreguntasFalladas(preguntasFalladas + 1);
    }
    setTiempoTotal(tiempoTotal+tiempoRestante);
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    setProgressPercent(100);

    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta + 1]);
    } else {
      setJuegoTerminado(true);
      if (preguntasCorrectas + preguntasFalladas > 0) {
        const preguntasTotales=preguntasCorrectas+preguntasFalladas;
        const tMedio=tiempoTotal/preguntasTotales;
        setTiempoMedio(tMedio);
      }
      guardarPartida();
    }
    };

  const guardarPartida = async () => {
    

    //Now we store the game in the stats DB
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "clasico",
      gameData: {
        correctAnswers: preguntasCorrectas,
        incorrectAnswers: preguntasFalladas,
        points: puntuacion,
        avgTime: tiempoMedio,
      },
    };
    
    try {
      const response = await axios.post(URL + '/saveGame', newGame);
      console.log("Solicitud exitosa:", response.data);
      
    } catch (error) {
      console.error('Error al guardar el juego:', error);
    }
  }

  const handleRepetirJuego = () => {
    // Reiniciar el estado para repetir el juego
    setIndicePregunta(0);
    setPuntuacion(0);
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    setJuegoTerminado(false);
    setMostrarMenu(false);
    setPreguntasCorrectas(0);
    setPreguntasFalladas(0);
    setTiempoMedio(0);
    setTiempoTotal(0);
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
          <h2>¡Juego terminado!</h2>
          <p>
            Tu puntuación: {puntuacion}/{preguntas.length}
          </p>
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
                onClick={() => handleRespuestaSeleccionada(respuesta)}
                disabled={tiempoRestante === 0 || juegoTerminado}
                style={estiloRespuesta(respuesta)}
              >
                {respuesta}
              </button>
            ))}
          </div>
          <div className="answer">
          <button
                onClick={() => {
                  setTiempoTotal(tiempoTotal+tiempoRestante);
                  setTiempoRestante(0);
                }}
                disabled={tiempoRestante === 0 || juegoTerminado}
              >
              Responder
              </button>
          </div>
          
          <div className="timer">Tiempo restante: {parseFloat(tiempoRestante).toFixed(2).toString()}</div>
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
