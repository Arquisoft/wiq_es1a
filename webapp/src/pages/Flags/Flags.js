import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.js";
import {
  Box,
  Flex,
  Heading,
  Button,
  Grid,
  useColorMode,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const JuegoPreguntas = () => {
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const SECS_PER_QUESTION = localStorage.getItem("clasicoTime");
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const { t, i18n } = useTranslation();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(SECS_PER_QUESTION);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntaTerminada, setPreguntaTerminada] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState("");
  const [progressPercent, setProgressPercent] = useState(100);
  const navigate = useNavigate();

  //Used for user stats
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [preguntasFalladas, setPreguntasFalladas] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [tiempoMedio, setTiempoMedio] = useState(0);
  const [questionsToSave, setQuestionsToSave] = useState([]);

  const sparqlQuery = `
        SELECT DISTINCT ?cityLabel ?flagLabel WHERE {
            ?city wdt:P31 wd:Q6256 .
            ?city wdt:P41 ?flag .
            SERVICE wikibase:label {
            bd:serviceParam wikibase:language "es" .
            }
        }
    `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
    sparqlQuery
  )}&format=json`;

useEffect(() => {
    axios.get(url)
        .then((response) => {
            console.log(response);
            if (!response) {
                navigate("/home?error=1");
                throw new Error("Error en la solicitud");
            }
            return response.data;
        })
        .then((data) => {
            setPreguntas(data.results.bindings);
            setPreguntaActual(generateNewQuestion());
            setIsLoading(false);
        })
        .catch((error) => {
            console.error(error);
            navigate("/home?error=1");
        });
    // eslint-disable-next-line
}, []);

  useEffect(() => {
    const roundedProgressPercent = (
      (tiempoRestante / SECS_PER_QUESTION) *
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
      const newTTotal = tiempoTotal + SECS_PER_QUESTION;
      setTiempoTotal(newTTotal);
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
        return isDarkTheme
          ? { color: "#333333", backgroundColor: "#F0F0F0" }
          : { backgroundColor: "#333333", color: "#F0F0F0" };
      }
    }
    return {};
  };

  const handleSiguientePregunta = () => {
    if (respuestaSeleccionada === preguntaActual.correct) {
      const newCorrectQuestions = preguntasCorrectas + 1;
      setPuntuacion(puntuacion + 1);
      setPreguntasCorrectas(newCorrectQuestions);
    } else {
      const newIncorrectQuestions = preguntasFalladas + 1;
      setPreguntasFalladas(newIncorrectQuestions);
    }

    const pregunta = {
      pregunta: preguntaActual.pregunta,
      respuestas: preguntaActual.respuestas,
      correcta: preguntaActual.correcta,
      respuesta: respuestaSeleccionada,
    };
    setQuestionsToSave([...questionsToSave, pregunta]);

    setTiempoTotal(tiempoTotal + tiempoRestante);
    setRespuestaSeleccionada(null);
    setTiempoRestante(10);
    setProgressPercent(100);

    if (indicePregunta + 1 < preguntas.length) {
      setIndicePregunta(indicePregunta + 1);
      setPreguntaActual(generateNewQuestion());
    } else {
      setJuegoTerminado(true);
      if (preguntasCorrectas + preguntasFalladas > 0) {
        const preguntasTotales = preguntasCorrectas + preguntasFalladas;
        const tMedio = tiempoTotal / preguntasTotales;
        setTiempoMedio(tMedio);
      }
    }
  };

  const generateNewQuestion = () => {
    console.log(data)
    var questions = [];
    var randomIndex = Math.floor(Math.random() * data.length);
    var label = data[randomIndex].cityLabel.value;
    var flag = data[randomIndex].flagLabel.value;

    for (let i = 0; i < 3; i++) {
      randomIndex = Math.floor(Math.random() * data.length);
      const randomQuestion = data[randomIndex];
      questions.push(randomQuestion.flagLabel.value);
    }
    return {
      question: `¿Cuál es la capital de ${label}?`,
      answers: questions,
      correct: flag,
    };
  };

  useEffect(() => {
    if (juegoTerminado && tiempoMedio !== 0) {
      guardarPartida();
    }
    // eslint-disable-next-line
  }, [juegoTerminado]);

  const guardarPartida = async () => {
    //Now we store the game in the stats DB
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "banderas",
      gameData: {
        correctAnswers: preguntasCorrectas,
        incorrectAnswers: preguntasFalladas,
        points: puntuacion,
        avgTime: tiempoMedio,
      },
      questions: questionsToSave,
    };

    try {
      const response = await axios.post(URL + "/saveGameList", newGame);
      console.log("Solicitud exitosa:", response.data);
    } catch (error) {
      console.error(
        "Error al guardar el juego en la lista de partidas:",
        error
      );
    }
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
          maxWidth={"90%"}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
        >
          {mostrarMenu ? (
            <Box textAlign="center">
              <Heading as="h2">{t("pages.classic.finished")}</Heading>
              <p p={2}>
                {t("pages.classic.score")} {puntuacion}/{preguntas.length}
              </p>
              {preguntasFalladas === 0 ? (
                <Box>
                  <Image src="/jordi.png" alt="Jordi Hurtado" />
                  <Text>{t("pages.classic.easterEgg")}</Text>
                </Box>
              ) : null}
              <Flex flexDirection={"column"}>
                <Button onClick={handleRepetirJuego} colorScheme="teal" m={2}>
                  {t("pages.classic.playAgain")}
                </Button>
                <Link to="/home" style={{ marginLeft: "10px" }}>
                  {t("pages.classic.back")}
                </Link>
              </Flex>
            </Box>
          ) : (
            <Box>
              <Heading as="h2" mb={4}>
                {t("pages.classic.question")} {indicePregunta + 1}
              </Heading>
              <p>{preguntaActual.question}</p>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {preguntaActual.answers.map((respuesta, index) => (
                  <a href={respuesta.flagLabel}></a>
                ))}
              </Grid>

              <Flex justify="center" mt={4}>
                <Button
                  onClick={() => {
                    const newTTotal =
                      tiempoTotal + (SECS_PER_QUESTION - tiempoRestante);
                    setTiempoTotal(newTTotal);
                    setTiempoRestante(0);
                  }}
                  disabled={tiempoRestante === 0 || juegoTerminado}
                  colorScheme="teal"
                  m={2}
                >
                  {t("pages.classic.answer")}
                </Button>
              </Flex>
              <Box textAlign="center" mt={4}>
                <p>
                  {t("pages.classic.time")} {Math.floor(tiempoRestante)}
                </p>
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
