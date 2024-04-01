import React, { useState, useEffect } from "react";
import { Select, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, Flex } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Ranking = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

  const [ranking, setRanking] = useState([]);
  const [filterBy, setFilterBy] = useState("avgPoints");
  const [displayOptions] = useState([
    { value: "avgPoints", label: "Puntos promedio" },
    { value: "totalPoints", label: "Puntos totales" },
    { value: "ratioCorrect", label: "Ratio de aciertos" },
    { value: "avgTime", label: "Tiempo por pregunta (s)" },
    { value: "avgPoints", label: "Reestablecer por defecto" }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");

  const fetchRanking = () => {
    setIsLoading(true);
    fetch(gatewayUrl + `/ranking?gamemode=${gamemode}&filterBy=${filterBy}`)
      .then((response) => response.json())
      .then((data) => {
        setRanking(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el ranking:', error);
        setError(error.message || 'Ha ocurrido un error al obtener el ranking');
        setIsLoading(false);
      });
  };

  const getModeName = () => {
    if(gamemode === "clasico"){
      return "Clásico";    
    } else if(gamemode === "bateria"){
      return "Batería de sabios";
    }
    return gamemode;
  };

  useEffect(() => {
    fetchRanking();
  }, [gamemode, filterBy]);

  const handleDisplayChange = (event) => {
    setFilterBy(event.target.value);
  };

  const getDisplayedField = () => {
    switch (filterBy) {
      case "avgPoints":
        return "Puntos promedio";
      case "totalPoints":
        return "Puntos totales";
      case "ratioCorrect":
        return "Ratio de aciertos (%)";
      case "avgTime":
        return "Tiempo por pregunta (s)";
      default:
        return "";
    }
  };

  const getDisplayValue = (stat) => {
    switch (filterBy) {
      case "avgPoints":
        return Math.round(stat.avgPoints * 100) / 100;
      case "totalPoints":
        return stat.totalPoints;
      case "ratioCorrect":
        return Math.round(stat.ratioCorrect * 100) / 100;
      case "avgTime":
        return Math.round(stat.avgTime * 100) / 100;
      default:
        return "";
    }
  };

  const handleGamemodeChange = (mode) => {
    setGamemode(mode);
    fetchRanking();
  };

  if (isLoading) {
    return (
      <div>
        <Heading as="h2">Cargando ...</Heading>
        <p>Se está consultando el ranking, espere unos instantes.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Heading as="h2">Error: {error}</Heading>
        <p>Ha ocurrido un error al obtener el ranking</p>
      </div>
    );
  }

  return (
    <>
    <Nav/>
    <Flex flexDirection="column" rowGap="1rem">
      <Heading as="h2">Ranking - modo {getModeName()}</Heading>
      <Select id="displaySelector" onChange={handleDisplayChange}>
        {displayOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Select>
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
      <Table>
        <Thead>
          <Tr>
            <Th>Usuario</Th>
            <Th>{getDisplayedField()}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ranking && ranking.map((stat, index) => (
            <Tr key={index}>
              <Td>{stat.username}</Td>
              <Td>{getDisplayValue(stat)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
    <Footer/>
    </>
  );
};

export default Ranking;


