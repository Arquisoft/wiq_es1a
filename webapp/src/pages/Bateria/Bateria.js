import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, Heading, Button, Grid } from "@chakra-ui/react";
import axios from 'axios';

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

    //Used for user stats
    const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
    const [preguntasFalladas, setPreguntasFalladas] = useState(0);
    const [tiempoMedio, setTiempoMedio] = useState(0);

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

      guardarPartida();
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const guardarPartida = async () => {
    if(preguntasCorrectas+preguntasFalladas>0){
      setTiempoMedio(180/(preguntasCorrectas+preguntasFalladas));
    }
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "bateria",
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

  useEffect(() => {
    setProgressPercent(tiempoRestante / TIME * 100);
  
    const timer = setInterval(() => {
      setTiempoRestante(prevTiempo => (prevTiempo <= 0 ? 0 : prevTiempo - 0.01));
    }, 10); 
  
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const handleSiguientePregunta = async (respuesta) => {
    if (respuesta === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(preguntasCorrectas+1);
    }
    else{
      setPreguntasFalladas(preguntasFalladas+1);
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
      <Flex justify="center" align="center" h="70vh">
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
          {juegoTerminado ? (
            <Box textAlign="center">
              <Heading as="h2">¡Juego terminado!</Heading>
              <p p={2}>
                Tu puntuación: {puntuacion}
              </p>
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
                    onClick={() => handleSiguientePregunta(respuesta)}
                    disabled={tiempoRestante === 0 || juegoTerminado}
                  >
                    {respuesta}
                  </Button>
                ))}
              </Grid>

              <Box textAlign="center" mt={4}>
                <p>Tiempo restante: {Math.floor(tiempoRestante)}</p>
                <p>Puntuación: {puntuacion}</p>
                <Box w="100%" bg="gray.100" borderRadius="lg" mt={4}>
                  <Box
                    bg="teal.500"
                    h="4px"
                    width={`${progressPercent}%`}
                  ></Box>
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
