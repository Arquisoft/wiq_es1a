import React, { useState, useEffect, useMemo } from "react";
import Nav from "../../components/Nav/Nav.js";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.js";
import { Box, Flex, Heading, Button, Grid, useColorMode, Text, Image } from "@chakra-ui/react";
import axios from "axios";

const JuegoPreguntas = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const SECS_PER_QUESTION = useMemo(() => localStorage.getItem("clasicoTime"));
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

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
      body: JSON.stringify({
        tematicas: localStorage.getItem("selectedThemes"),
        n: localStorage.getItem("clasicoPreguntas"),
      }),
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
    // eslint-disable-next-line
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
        return isDarkTheme? { color: "#333333", backgroundColor: "#F0F0F0" } : { backgroundColor: "#333333", color: "#F0F0F0" };
      }
    }
    return {};
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.correcta) { 
      const newCorrectQuestions=preguntasCorrectas+1;
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(newCorrectQuestions);
      console.log("bien")
    } else {
      const newIncorrectQuestions=preguntasFalladas+1;
      setPreguntasFalladas(newIncorrectQuestions);
      console.log("mal")
    }
    setTiempoTotal(tiempoTotal + tiempoRestante);
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    setProgressPercent(100);

    if (indicePregunta+1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta + 1]);
    } else {
      setJuegoTerminado(true);
      if (preguntasCorrectas + preguntasFalladas > 0) {
        const preguntasTotales=preguntasCorrectas+preguntasFalladas;
        console.log(preguntasCorrectas);
        console.log(preguntasFalladas);
        const tMedio=tiempoTotal/preguntasTotales;
        setTiempoMedio(tMedio);
        
      }
    }
    
    };

    useEffect(() => {
      if (juegoTerminado) {
        guardarPartida();
      }
    }, [juegoTerminado]);

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
      const response = await axios.post(URL + "/saveGame", newGame);
      console.log("Solicitud exitosa:", response.data);
    } catch (error) {
      console.error("Error al guardar el juego:", error);
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
      <Flex justify="center" align="center" h="70vh">
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
          {mostrarMenu ? (
            <Box textAlign="center">
              <Heading as="h2">¡Juego terminado!</Heading>
              <p p={2}>
                Tu puntuación: {puntuacion}/{preguntas.length}
              </p>
              {preguntasFalladas === 0 ? (
                <Box>
                  <Image src="/jordi.png" alt="Jordi Hurtado" />
                  <Text>¡Has acertado todas! Eres la cuenta secundaria de Jordi Hurtado.</Text>
                </Box>
              ) : null}
              <Button onClick={handleRepetirJuego} colorScheme="teal" m={2}>
                Repetir Juego
              </Button>
              <Link to="/home" style={{ marginLeft: "10px" }}>
                Volver al Menú Principal
              </Link>
            </Box>
          ) : (
            <Box>
              <Heading as="h2" mb={4}>
                Pregunta {indicePregunta + 1}
              </Heading>
              <p>{preguntaActual.pregunta}</p>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {preguntaActual.respuestas.map((respuesta, index) => (
                  <Button
                    key={index}
                    onClick={() => handleRespuestaSeleccionada(respuesta)}
                    disabled={tiempoRestante === 0 || juegoTerminado}
                    style={estiloRespuesta(respuesta)}
                  >
                    {respuesta}
                  </Button>
                ))}
              </Grid>
  
              <Flex justify="center" mt={4}>
                <Button
                  onClick={() => setTiempoRestante(0)}
                  disabled={tiempoRestante === 0 || juegoTerminado}
                  colorScheme="teal"
                  m={2}
                >
                  Responder
                </Button>
              </Flex>
              <Box textAlign="center" mt={4}>
                <p>Tiempo restante: {Math.floor(tiempoRestante)}</p>
                <p>Puntuación: {puntuacion}</p>
                <Box w="100%" bg="gray.100" borderRadius="lg" mt={4}>
                  <Box bg="teal.500" h="4px" width={`${progressPercent}%`}></Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
      <Footer />
    </>
  );  
};

export default JuegoPreguntas;
