import React, { useState, useEffect } from "react";
import { Input, Button, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Stats = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

  const [username, setUsername] = useState(localStorage.username || 'test');
  const [stats, setStats] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = () => {
    setIsLoading(true);
    fetch(gatewayUrl+`/stats?user=${username}&gamemode=${gamemode}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las estadísticas:', error);
        setError(error.message || 'Ha ocurrido un error al obtener las estadísticas');
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchStats(); // Eliminamos el retardo para la primera llamada
  }, [username, gamemode]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleGamemodeChange = (mode) => {
    setGamemode(mode);
    // Llama a fetchStats() para actualizar las estadísticas cuando se cambia el modo de juego
    fetchStats();
  };

  const getModeName = () => {
    if(gamemode=="clasico"){
      return "Clásico";    
    }else if(gamemode=="bateria"){
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
        <div>
          <label htmlFor="usernameInput">Nombre de usuario: </label>
          <Input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <Heading as="h2">Error: {error}</Heading>
          <p>
            Por favor compruebe si los valores del formulario son correctos e
            inténtelo de nuevo
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Nav />
    <div>
      <label htmlFor="usernameInput"> <strong>Nombre de usuario: </strong></label>
      <Input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
      <div>
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
      </div>
      {stats === null && !isLoading && (
          <div>
            <p>El usuario no ha jugado ninguna partida.</p>
          </div>
        )}
        {stats && (
          <div>
            <Heading as="h2">Estadísticas de {stats.username} - modo {getModeName()}</Heading>
            <Table>
            <Tbody>
              <Tr>
                <Td><strong>Partidas jugadas</strong></Td>
                <Td>{stats.nGamesPlayed}</Td>
              </Tr>
              <Tr>
                <Td><strong>Puntos por partida</strong></Td>
                <Td>{stats.avgPoints.toFixed(2)}</Td>
               </Tr>
              <Tr>
                <Td><strong>Puntos totales</strong></Td>
                <Td>{stats.totalPoints}</Td>
              </Tr>
              <Tr>
                <Td><strong>Preguntas correctas totales</strong></Td>
                <Td>{stats.totalCorrectQuestions}</Td>
              </Tr>
              <Tr>
                <Td><strong>Preguntas incorrectas totales</strong></Td>
                <Td>{stats.totalIncorrectQuestions}</Td>
              </Tr>
              <Tr>
                <Td><strong>Porcentaje de aciertos</strong></Td>
                <Td>{stats.ratioCorrect.toFixed(2)}%</Td>
              </Tr>
              <Tr>
                <Td><strong>Tiempo por pregunta (s):</strong></Td>
                <Td>{stats.avgTime.toFixed(2)}</Td>
              </Tr>
            </Tbody>
          </Table>
          </div>
        )}
    </div>
    <Footer />
    </>
    
  );
}

export default Stats;