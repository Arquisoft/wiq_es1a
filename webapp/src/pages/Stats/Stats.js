import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Box,
  Flex
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Stats = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

  const [username, setUsername] = useState(localStorage.username || "error");
  const [stats, setStats] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchStats = (mode) => {
    setIsLoading(true);
    fetch(gatewayUrl + `/stats?user=${username}&gamemode=${mode}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las estadísticas:", error);
        setError(
          error.message || "Ha ocurrido un error al obtener las estadísticas"
        );
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!fetched) {
      fetchStats(gamemode);
      setFetched(true);
    }
    // eslint-disable-next-line
  }, [username, gamemode]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleGamemodeChange = async (mode) => {
    if (mode === gamemode) return;
  
    setGamemode(mode);
    fetchStats(mode);
  };
  

  const handleSearch = () => {
    fetchStats(gamemode);
  };

  const getModeName = () => {
    if (gamemode === "clasico") {
      return "Clásico";
    } else if (gamemode === "bateria") {
      return "Batería de sabios";
    }
    return gamemode;
  };

  if (isLoading) {
    return (
      <div>
        <Heading as="h2"> Cargando ... </Heading>
        <p>Se está consultando su búsqueda, espere unos instantes.</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <Box>
          <label htmlFor="usernameInput">Nombre de usuario: </label>
          <Input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <Button onClick={handleSearch}>Buscar</Button>
          <Heading as="h2">Error: {error}</Heading>
          <p marginTop="1rem">
            Por favor compruebe si los valores del formulario son correctos e
            inténtelo de nuevo
          </p>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Box>
        <label htmlFor="usernameInput">
          {" "}
          <strong>Nombre de usuario: </strong>
        </label>
        <Flex columnGap="1rem" justifyContent="space-between">
          <Input
            width="85%"
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <Button onClick={handleSearch}>Buscar</Button>
        </Flex>
        <Flex rowGap="0.5rem" justifyContent="center" m="0.5rem 0" flexDirection="column">
          <Button
            className={gamemode === "clasico" ? "active" : ""}
            onClick={() => handleGamemodeChange("clasico")}
          >
            Clásico
          </Button>
          <Button
            className={gamemode === "bateria" ? "active" : ""}
            onClick={() => handleGamemodeChange("bateria")}
          >
            Batería de sabios
          </Button>
        </Flex>
        {stats === null && !isLoading && (
          <p mt="10rem">El usuario no ha jugado ninguna partida.</p>
        )}
        {stats && (
          <div>
            <Heading as="h2">
              Estadísticas de {stats.username} - modo {getModeName()}
            </Heading>
            <Table>
              <Tbody>
                <Tr>
                  <Td>
                    <strong>Partidas jugadas</strong>
                  </Td>
                  <Td>{stats.nGamesPlayed}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Puntos por partida</strong>
                  </Td>
                  <Td>{stats.avgPoints.toFixed(2)}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Puntos totales</strong>
                  </Td>
                  <Td>{stats.totalPoints}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Preguntas correctas totales</strong>
                  </Td>
                  <Td>{stats.totalCorrectQuestions}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Preguntas incorrectas totales</strong>
                  </Td>
                  <Td>{stats.totalIncorrectQuestions}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Porcentaje de aciertos</strong>
                  </Td>
                  <Td>{stats.ratioCorrect.toFixed(2)}%</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Tiempo por pregunta (s):</strong>
                  </Td>
                  <Td>{stats.avgTime.toFixed(2)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </div>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Stats;
