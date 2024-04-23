import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Button, Input } from "@chakra-ui/react";
import axios from 'axios';
import { useTranslation } from "react-i18next";

const generateRandomOperation = () => {
  let operators = ["+", "-", "*", "/"];
  let operator = operators[Math.floor(Math.random() * operators.length)];
  let num1 = Math.floor(Math.random() * 10 + 1);
  let num2 = Math.floor(Math.random() * 10 + 1);
  if (operator === "/") {
    let numCandidates = findDivisors(num1);
    let num2 = numCandidates[Math.floor(Math.random() * numCandidates.length)];
    return `${num1} ${operator} ${num2}`;
  }

  return `${num1} ${operator} ${num2}`;
};

function findDivisors(num) {
  const divisors = [];
  const sqrtNum = Math.sqrt(Math.abs(num));

  for (let i = 1; i <= sqrtNum; i++) {
    if (num % i === 0) {
      divisors.push(i);
      if (i !== sqrtNum) {
        divisors.push(num / i);
      }
    }
  }

  return divisors;
}

const CalculadoraHumana = () => {
  const TIME = 60;
  const URL = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const { t } = useTranslation();

  const [valSubmit, setValSubmit] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [operation, setOperation] = useState(generateRandomOperation());
  const [tiempoRestante, setTiempoRestante] = useState(TIME);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);

  const [tiempoMedio, setTiempoMedio] = useState(0);

  useEffect(() => {
    if (tiempoRestante === 0) {
      setJuegoTerminado(true);
      if(puntuacion>0){
        const tMedio=TIME/puntuacion;
        setTiempoMedio(tMedio);
      }
    }
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => (prevTiempo <= 0 ? 0 : prevTiempo - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [tiempoRestante, puntuacion]);

  useEffect(() => {
    setProgressPercent((tiempoRestante / TIME) * 100);

    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) =>
        prevTiempo <= 0 ? 0 : prevTiempo - 0.01
      );
    }, 10);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [tiempoRestante]);

  useEffect(() => {
    if (juegoTerminado && tiempoMedio !== 0) {
      guardarPartida();
    }
    // eslint-disable-next-line
  }, [juegoTerminado, tiempoMedio]);

  const guardarPartida = async () => {
    
    const username = localStorage.getItem("username");
    const newGame = {
      username: username,
      gameMode: "calculadora",
      gameData: {
        correctAnswers: 0,
        incorrectAnswers: 0,
        points: puntuacion,
        avgTime: tiempoMedio,
      }
    };
    try {
      const response = await axios.post(URL + '/saveGame', newGame);
      console.log("Solicitud exitosa:", response.data);
      
    } catch (error) {
      console.error('Error al guardar el juego:', error);
    }
    try {
      const response = await axios.post(URL + "/saveGameList", newGame);
      console.log("Solicitud exitosa:", response.data);
    } catch (error) {
      console.error("Error al guardar el juego:", error);
    }
  }

  const handleAnswer = (valSubmit) => {
    setValSubmit("");
    valSubmit = Number(valSubmit);

    // eslint-disable-next-line no-eval
    let evalued = eval(operation);
    if (valSubmit === evalued) {
      setPuntuacion(puntuacion + 1);
      let newOperation = generateOperation(valSubmit);
      setOperation(newOperation);
    } else {
      if(puntuacion>0){
        const tMedio=(TIME-tiempoRestante)/puntuacion;
        setTiempoMedio(tMedio);
      }
      setJuegoTerminado(true);
    }
  };

  const generateOperation = (valSubmit) => {
    valSubmit = Number(valSubmit);

    let operators = ["+", "-", "*", "/"];
    let operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 10 + 1);
    let operation = `${valSubmit} ${operator} ${num1}`;
    if (operator === "/") {
      if(valSubmit === 0){
        return `${valSubmit} ${operator} ${1}`;
      }
      let numCandidates = findDivisors(valSubmit);
      let num2 =
        numCandidates[Math.floor(Math.random() * numCandidates.length)];
      return `${valSubmit} ${operator} ${num2}`;
    }
    return operation;
  };

  const handleRepetirJuego = () => {
    setPuntuacion(0);
    setTiempoRestante(60);
    setJuegoTerminado(false);
    setOperation(generateRandomOperation());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAnswer(Number(event.target.value));
    }
  };

  return (
    <>
      <Nav />
      <Flex justify="center" align="center" h="70vh">
        <Box p={6} borderWidth="1px" maxWidth={"90%"} borderRadius="lg" boxShadow="lg">
          {juegoTerminado ? (
            <Box textAlign="center">
              <Heading as="h2">{t('pages.humancalculator.finished')}</Heading>
              <p p={2}>Tu puntuación: {puntuacion}</p>
              <Flex flexDirection={"column"}>
                <Button onClick={handleRepetirJuego} colorScheme="teal" m={2} data-testid="play-again-button">
                  {t('pages.humancalculator.playAgain')}
                </Button>
                <Link to="/home" style={{ marginLeft: "10px" }}>
                  {t('pages.humancalculator.back')}
                </Link>
              </Flex>
            </Box>
          ) : (
            <Box>
              <Heading as="h2" mb={4} data-testid="operation">
                {operation} = ?
              </Heading>
              <Input
                type="number"
                title="number"
                value={valSubmit}
                onChange={(e) => setValSubmit(e.target.value)}
                onKeyDown={handleKeyDown}
                data-testid="answer-input"
              />
              <Button mt={3} onClick={() => handleAnswer(Number(valSubmit))} data-testid="submit-button">
                {" "}
                Enviar{" "}
              </Button>
              <Box textAlign="center" mt={4}>
                <p>{t('pages.humancalculator.time')} {Math.floor(tiempoRestante)}</p>
                <p>{t('pages.humancalculator.score')} {puntuacion}</p>
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

export default CalculadoraHumana;
