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

  const [isLoading, setIsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswers, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(SECS_PER_QUESTION);
  const [endgame, setEndgame] = useState(false);
  const [endQuestion, setEndQuestion] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [actualQuestion, setActualQuestion] = useState("");
  const [progressPercent, setProgressPercent] = useState(100);
  const navigate = useNavigate();

  //Used for user stats
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [questionsToSave, setQuestionsToSave] = useState([]);

  useEffect(() => {
    fetch(URL + "/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tematicas: localStorage.getItem("selectedThemes"),
        n: localStorage.getItem("clasicoPreguntas"),
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
        navigate("/home?error=1");
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const roundedProgressPercent = (
      (timeLeft / SECS_PER_QUESTION) *
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
      const newTTotal = totalTime + SECS_PER_QUESTION;
      setTotalTime(newTTotal);
      setEndQuestion(true);
      setTimeout(() => {
        setEndQuestion(false);
        handleNextQuestion();
      }, 3000);
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [timeLeft]);

  useEffect(() => {
    if (endgame) {
      setShowMenu(true);
    }
    // eslint-disable-next-line
  }, [endgame]);

  const handleAnsweredQuestion = (respuesta) => {
    if (!endgame) {
      setSelectedAnswer(respuesta);
    }
  };

  const answerStyle = (answer) => {
    if (endQuestion) {
      if (answer === actualQuestion.correcta) {
        return { backgroundColor: "#10FF00" };
      } else if (answer === selectedAnswers) {
        return { backgroundColor: "red" };
      }
    } else if (answer === selectedAnswers) {
      return isDarkTheme
        ? { color: "#333333", backgroundColor: "#F0F0F0" }
        : { backgroundColor: "#333333", color: "#F0F0F0" };
    }
    return {};
  };

  const handleNextQuestion = () => {
    if (selectedAnswers === actualQuestion.correcta) {
      const newCorrectQuestions = correctAnswers + 1;
      setPoints(points + 1);
      setCorrectAnswers(newCorrectQuestions);
    } else {
      const newIncorrectQuestions = incorrectAnswers + 1;
      setIncorrectAnswers(newIncorrectQuestions);
    }

    const question = {
      pregunta: actualQuestion.pregunta,
      respuestas: actualQuestion.respuestas,
      correcta: actualQuestion.correcta,
      respuesta: selectedAnswers,
    };
    setQuestionsToSave([...questionsToSave, question]);

    setTotalTime(totalTime + timeLeft);
    setSelectedAnswer(null);
    setTimeLeft(10);
    setProgressPercent(100);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setActualQuestion(questions[questionIndex + 1]);
    } else {
      setEndgame(true);
      if (correctAnswers + incorrectAnswers > 0) {
        const totalAnswers = correctAnswers + incorrectAnswers;
        const avgTime = totalTime / totalAnswers;
        setAverageTime(avgTime);
      }
    }
  };

  useEffect(() => {
    if (endgame && averageTime !== 0) {
      saveGame();
    }
    // eslint-disable-next-line
  }, [endgame]);

  const saveGame = async () => {
    //Now we store the game in the stats DB
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "clasico",
      gameData: {
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers,
        points: points,
        avgTime: averageTime,
      },
      questions: questionsToSave,
    };

    try {
      await axios.post(URL + "/saveGameList", newGame);
    } catch (error) {
      console.error(error);
    }
    try {
      await axios.post(URL + "/saveGame", newGame);
    } catch (error) {
      console.error("Error al guardar el juego:", error);
    }
  };

  const handleRepetirJuego = () => {
    // Reset all the game variables
    setQuestionIndex(0);
    setPoints(0);
    setSelectedAnswer(null);
    setTimeLeft(10);
    setEndgame(false);
    setShowMenu(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAverageTime(0);
    setTotalTime(0);
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
          {showMenu ? (
            <Box textAlign="center">
              <Heading as="h2">{t("pages.classic.finished")}</Heading>
              <p p={2}>
                {t("pages.classic.score")} {points}/{questions.length}
              </p>
              {incorrectAnswers === 0 ? (
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
              <Heading as="h2" mb={4} data-testid="question">
                {t("pages.classic.question")} {questionIndex + 1}
              </Heading>
              <p>{actualQuestion.pregunta}</p>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                {actualQuestion.respuestas.map((respuesta, index) => (
                  <Button
                    onClick={() => handleAnsweredQuestion(respuesta)}
                    disabled={timeLeft === 0 || endgame}
                    style={answerStyle(respuesta)}
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

              <Flex justify="center" mt={4}>
                <Button
                  onClick={() => {
                    const newTTotal =
                      totalTime + (SECS_PER_QUESTION - timeLeft);
                    setTotalTime(newTTotal);
                    setTimeLeft(0);
                  }}
                  disabled={timeLeft === 0 || endgame}
                  colorScheme="teal"
                  m={2}
                  data-testid="answer-button"
                >
                  {t("pages.classic.answer")}
                </Button>
              </Flex>
              <Box textAlign="center" mt={4}>
                <p>
                  {t("pages.classic.time")} {Math.floor(timeLeft)}
                </p>
                <p>{t("pages.classic.score")} {points}</p>
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
