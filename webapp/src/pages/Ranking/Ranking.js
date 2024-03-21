import React, { useState, useEffect } from "react";
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
    { value: "avgTime", label: "Tiempo por pregunta (s)" }
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
    if(gamemode=="clasico"){
      return "Clásico";    
    }else if(gamemode=="bateria"){
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
        <h2>Cargando ...</h2>
        <p>Se está consultando el ranking, espere unos instantes.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
        <p>Ha ocurrido un error al obtener el ranking</p>
      </div>
    );
  }

  return (
    <>
    <Nav/>
    <div>
      <h2>Ranking - Modo {getModeName()}</h2>
      <div>
        <label htmlFor="displaySelector">Mostrar:</label>
        <select id="displaySelector" onChange={handleDisplayChange}>
          {displayOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div>
        <button
          className={gamemode === "clasico" ? "active" : ""}
          onClick={() => handleGamemodeChange("clasico")}
        >
        Clásico
        </button>
        <button
          className={gamemode === "bateria" ? "active" : ""}
          onClick={() => handleGamemodeChange("bateria")}
        >
          Batería de sabios
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>{getDisplayedField()}</th>
          </tr>
        </thead>
        <tbody>
          {ranking && ranking.map((stat, index) => (
            <tr key={index}>
              <td>{stat.username}</td>
              <td>{getDisplayValue(stat)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  );
};

export default Ranking;

