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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [endgame, setEndgame] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [actualQuestion, setActualQuestion] = useState(null);
  const [progressPercent, setProgressPercent] = useState(100);

  //Used for user stats
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [averageTime, setAverageTime] = useState(0);

  const questionsToSave = [];

  useEffect(() => {
    setProgressPercent(100);
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const roundedProgressPercent = (
      (timeLeft / TIME) *
      100
    ).toFixed(2);
    setProgressPercent(roundedProgressPercent);

    const timer = setInterval(() => {
      setTimeLeft((prevTiempo) =>
        prevTiempo <= 0 ? 0 : prevTiempo - 0.01
      );
    }, 10);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setEndgame(true);
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [timeLeft]);

  useEffect(() => {
    if (endgame && averageTime !== 0) {
      saveGame();
    }
    // eslint-disable-next-line
  }, [endgame, averageTime]);

  useEffect(() => {
    if (timeLeft === 0) {
      setEndgame(true);
      if (correctAnswers + incorrectAnswers > 0) {
        const preguntasTotales = correctAnswers + incorrectAnswers;
        const tMedio = TIME / preguntasTotales;
        setAverageTime(tMedio);
      }
    }
    // eslint-disable-next-line
  }, [timeLeft]);

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
        setQuestions(data);
        setActualQuestion(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las questions:", error);
        navigate("/home?error=1");
      });
  };

  const saveGame = async () => {
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "bateria",
      gameData: {
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers,
        points: points,
        avgTime: averageTime,
      },
      questions: questionsToSave,
    };

    save("/save", newGame);
    save("/saveGameList", newGame);
  };

  const save = async (endpoint, newGame) => {
    try {
      await axios.post(URL + endpoint, newGame);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextQuestion = async (answer) => {
    if (answer === actualQuestion.correcta) {
      setPoints(points + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    const pregunta = {
      pregunta: actualQuestion.pregunta,
      respuestas: actualQuestion.respuestas,
      correcta: actualQuestion.correcta,
      respuesta: answer,
    };
    questionsToSave.push(pregunta);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setActualQuestion(questions[questionIndex + 1]);
    } else {
      setEndgame(true);
    }
  };

  const handleRematch = () => {
    setQuestionIndex(0);
    setPoints(0);
    setTimeLeft(180);
    setEndgame(false);
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
          {endgame ? (
            <Box textAlign="center">
              <Heading as="h2">{t("pages.wisebattery.finished")}</Heading>
              <p p={2}>
                {t("pages.wisebattery.score")} {points}
              </p>
              <Flex flexDirection={"column"}>
                <Button onClick={handleRematch} colorScheme="teal" m={2}>
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
                {t("pages.wisebattery.question")} {questionIndex + 1}
              </Heading>
              <p>{actualQuestion.pregunta}</p>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {actualQuestion.respuestas.map((respuesta, index) => (
                  <Button
                    onClick={() => handleNextQuestion(respuesta)}
                    disabled={timeLeft === 0 || endgame}
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
                  {t("pages.wisebattery.time")} {Math.floor(timeLeft)}
                </p>
                <p>
                  {t("pages.wisebattery.score")} {points}
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
