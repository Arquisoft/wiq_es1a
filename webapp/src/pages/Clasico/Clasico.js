import React, { useState, useEffect } from "react";
import "./Clasico.css";
import Nav from "../../components/Nav/Nav.js";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.js";

const JuegoPreguntas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntaTerminada, setPreguntaTerminada] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false); // Estado para mostrar el menú al finalizar el juego
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState("");
  const navigate = useNavigate();

  //Used for user stats
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [preguntasFalladas, setPreguntasFalladas] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [tiempoMedio, setTiempoMedio] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8003/questions?tematica=all&n=10")
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
        setPreguntaActual(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las preguntas:", error);
        alert("Hubo un error al cargar las preguntas");
        navigate("/home");
      });
  }, []);

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
  }, [tiempoRestante]);

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
    if (preguntaTerminada) {
      if (respuesta === preguntaActual.correcta) {
        return { backgroundColor: "#10FF00" };
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

  const handleSiguientePregunta = async () => {
    if (respuestaSeleccionada === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(preguntasCorrectas + 1);
    } else {
      setPreguntasFalladas(preguntasFalladas + 1);
    }

    setTiempoTotal(tiempoTotal + 10 - tiempoRestante);

    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta + 1]);
    } else {
      try {
        if (preguntasCorrectas + preguntasFalladas > 0) {
          setTiempoMedio(
            tiempoTotal / (preguntasCorrectas + preguntasFalladas)
          );
        }

        //Now we store the game in the user's DB
        const username = localStorage.getItem("username");
        const newGame = {
          username: username,
          correctAnswers: preguntasCorrectas,
          incorrectAnswers: preguntasFalladas,
          points: puntuacion,
          avgTime: tiempoMedio,
        };

        const response = await fetch("http://localhost:8001/userSaveGame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newGame),
        });

        if (!response.ok) {
          throw new Error("Error al guardar el juego");
        }
      } catch (error) {
        console.error("Error al guardar el juego:", error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
      } finally {
        setJuegoTerminado(true);
      }
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
          <div className="timer">Tiempo restante: {tiempoRestante}</div>
          <div className="points">Puntuación: {puntuacion}</div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default JuegoPreguntas;
