import React, { useState, useEffect } from "react";

const Ranking = ({ gatewayUrl, gamemode, filterBy, handleDisplayChange }) => {
  const [ranking, setRanking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayOptions] = useState([
    { value: "avgPoints", label: "Puntos promedio" },
    { value: "totalPoints", label: "Puntos totales" },
    { value: "ratioCorrect", label: "Ratio de aciertos" }
  ]);

  const fetchRanking = () => {
    setIsLoading(true);
    fetch(`${gatewayUrl}/ranking?gamemode=${gamemode}&filterBy=${filterBy}`)
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
  
  useEffect(() => {
    fetchRanking();
  }, [gamemode, filterBy]);

  const getDisplayedField = () => {
    switch (filterBy) {
        case "avgPoints":
            return "Puntos promedio";
        case "totalPoints":
            return "Puntos totales";
        case "ratioCorrect":
            return "Ratio de aciertos";
        default:
            return "";
    }
  };

  const getDisplayValue = (stat) => {
    switch (filterBy) {
        case "avgPoints":
            return stat.avgPoints.toFixed(2);
        case "totalPoints":
            return stat.totalPoints;
        case "ratioCorrect":
            return stat.ratioCorrect.toFixed(2);
        default:
            return "";
    }
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
        <p>Ha ocurrido un error al obtener el ranking.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Ranking - Modo {gamemode}</h2>
      <div>
        <label htmlFor="displaySelector">Mostrar:</label>
        <select id="displaySelector" onChange={handleDisplayChange}>
          {displayOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>{getDisplayedField()}</th>
          </tr>
        </thead>
        <tbody>
          {ranking && ranking.length > 0 ? (
            ranking.map((stat, index) => (
              <tr key={index}>
                <td>{stat.username}</td>
                <td>{getDisplayValue(stat)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
