import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Button, Input } from "@chakra-ui/react";

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
  const sqrtNum = Math.sqrt(num);

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

  const [valSubmit, setValSubmit] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [operation, setOperation] = useState(generateRandomOperation());
  const [tiempoRestante, setTiempoRestante] = useState(TIME);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);

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
    setProgressPercent((tiempoRestante / TIME) * 100);

    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) =>
        prevTiempo <= 0 ? 0 : prevTiempo - 0.01
      );
    }, 10);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [tiempoRestante]);

  const handleAnswer = (valSubmit) => {
    valSubmit = Number(valSubmit);

    let evalued = eval(operation);
    if (valSubmit === evalued) {
      setPuntuacion(puntuacion + 1);
      let newOperation = generateOperation(valSubmit);
      setOperation(newOperation);
    } else {
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
      let numCandidates = findDivisors(valSubmit);
      let num2 =
        numCandidates[Math.floor(Math.random() * numCandidates.length)];
      operation = `${valSubmit} ${operator} ${num2}`;
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
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
          {juegoTerminado ? (
            <Box textAlign="center">
              <Heading as="h2">¡Juego terminado!</Heading>
              <p p={2}>Tu puntuación: {puntuacion}</p>
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
                ¿{operation}?
              </Heading>
              <Input
                type="number"
                value={valSubmit}
                onChange={(e) => setValSubmit(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={() => handleAnswer(Number(valSubmit))}>
                {" "}
                Enviar{" "}
              </Button>
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

export default CalculadoraHumana;
