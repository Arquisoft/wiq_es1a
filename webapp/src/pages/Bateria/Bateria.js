import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, Heading, Button, Grid, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const JuegoPreguntas = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const TIME = localStorage.getItem("bateriaTime");

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIME);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [progressPercent, setProgressPercent] = useState(100);

  //Used for user stats
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [preguntasFalladas, setPreguntasFalladas] = useState(0);
  const [tiempoMedio, setTiempoMedio] = useState(0);

  const questionsToSave = [];

  useEffect(() => {
    setProgressPercent(100);
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const roundedProgressPercent = (
      (tiempoRestante / TIME) *
      100
    ).toFixed(2);
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
      setJuegoTerminado(true);
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [tiempoRestante]);

  useEffect(() => {
    if (juegoTerminado && tiempoMedio !== 0) {
      guardarPartida();
    }
    // eslint-disable-next-line
  }, [juegoTerminado, tiempoMedio]);

  useEffect(() => {
    if (tiempoRestante === 0) {
      setJuegoTerminado(true);
      if (preguntasCorrectas + preguntasFalladas > 0) {
        const preguntasTotales = preguntasCorrectas + preguntasFalladas;
        const tMedio = TIME / preguntasTotales;
        setTiempoMedio(tMedio);
      }
    }
    // eslint-disable-next-line
  }, [tiempoRestante]);

  const fetchQuestions = () => {
    fetch(URL + "/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tematicas: localStorage.getItem("selectedThemes") || "paises",
        n: 9000,
        locale: i18n.language,
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
  };

  const guardarPartida = async () => {
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
      questions: questionsToSave,
    };

    saveGame("/saveGame", newGame);
    saveGame("/saveGameList", newGame);
  };

  const saveGame = async (endpoint, newGame) => {
    try {
      await axios.post(URL + endpoint, newGame);
    } catch (error) {
      console.error("Error al guardar el juego:", error);
    }
  };

  const handleSiguientePregunta = async (respuesta) => {
    if (respuesta === preguntaActual.correcta) {
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(preguntasCorrectas + 1);
    } else {
      setPreguntasFalladas(preguntasFalladas + 1);
    }

    const pregunta = {
      pregunta: preguntaActual.pregunta,
      respuestas: preguntaActual.respuestas,
      correcta: preguntaActual.correcta,
      respuesta: respuesta,
    };
    questionsToSave.push(pregunta);

    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(preguntas[indicePregunta + 1]);
    } else {
      setJuegoTerminado(true);
    }
  };

  const handleRepetirJuego = () => {
    setIndicePregunta(0);
    setPuntuacion(0);
    setTiempoRestante(180);
    setJuegoTerminado(false);
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <Spinner
          data-testid="spinner"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
          margin="auto"
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Flex justify="center" align="center" h="70vh">
        <Box
          p={6}
          borderWidth="1px"
          maxWidth={"90%"}
          borderRadius="lg"
          boxShadow="lg"
        >
          {juegoTerminado ? (
            <Box textAlign="center">
              <Heading as="h2">{t("pages.wisebattery.finished")}</Heading>
              <p p={2}>
                {t("pages.wisebattery.score")} {puntuacion}
              </p>
              <Flex flexDirection={"column"}>
                <Button onClick={handleRepetirJuego} colorScheme="teal" m={2}>
                  {t("pages.wisebattery.playAgain")}
                </Button>
                <Link to="/home" style={{ marginLeft: "10px" }}>
                  {t("pages.wisebattery.back")}
                </Link>
              </Flex>
            </Box>
          ) : (
            <Box>
              <Heading as="h2" mb={4} data-testid="question">
                {t("pages.wisebattery.question")} {indicePregunta + 1}
              </Heading>
              <p>{preguntaActual.pregunta}</p>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {preguntaActual.respuestas.map((respuesta, index) => (
                  <Button
                    onClick={() => handleSiguientePregunta(respuesta)}
                    disabled={tiempoRestante === 0 || juegoTerminado}
                    whiteSpace={"normal"}
                    padding={"1rem"}
                    height={"fit-content"}
                    minHeight={"3rem"}
                    data-testid={`answer-button-${index}`}
                  >
                    {respuesta}
                  </Button>
                ))}
              </Grid>

              <Box textAlign="center" mt={4}>
                <p>
                  {t("pages.wisebattery.time")} {Math.floor(tiempoRestante)}
                </p>
                <p>
                  {t("pages.wisebattery.score")} {puntuacion}
                </p>
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
