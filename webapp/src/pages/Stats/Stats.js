import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import "./Stats.css";

const Stats = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

  const [username, setUsername] = useState(localStorage.username);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(gatewayUrl + `/getstats?user=${username}`)
        .then((response) => response.json())
        .then((data) => {
          setStats(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener las preguntas:", error);
          setError(error);
          setIsLoading(false);
        });
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  if (isLoading) {
    return (
      <div>
        <h2> Cargando ... </h2>
        <p>Se está consultando su búsqueda, espere unos instantes.</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div>
          <label htmlFor="usernameInput">Nombre de Usuario: </label>
          <input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <h2>Error: {error}</h2>
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
      <h2>Estadísticas de Usuario</h2>
      <label htmlFor="usernameInput"> <strong>Nombre de Usuario: </strong></label>
      <input
        type="text"
        id="usernameInput"
        value={username}
        onChange={handleUsernameChange}
        data-testid="usernameInput"
      />
      {stats === null && !isLoading && (
          <div>
            <p>El usuario no ha jugado ninguna partida.</p>
          </div>
        )}
      {stats && (
        <div>
          <table>
            <tr>
              <td><strong>Usuario:</strong></td>
              <td>{stats.username}</td>
            </tr>
            <tr>
              <td><strong>Juegos Jugados:</strong></td>
              <td>{stats.nGamesPlayed}</td>
            </tr>
            <tr>
              <td><strong>Promedio de Puntos:</strong></td>
              <td>{stats.avgPoints.toFixed(2)}</td>
             </tr>
            <tr>
              <td><strong>Puntos Totales:</strong></td>
              <td>{stats.totalPoints}</td>
            </tr>
            <tr>
              <td><strong>Preguntas Correctas Totales:</strong></td>
              <td>{stats.totalCorrectQuestions}</td>
            </tr>
            <tr>
              <td><strong>Preguntas Incorrectas Totales:</strong></td>
              <td>{stats.totalIncorrectQuestions}</td>
            </tr>
            <tr>
              <td><strong>Ratio Correctas/Incorrectas:</strong></td>
              <td>{stats.ratioCorrectToIncorrect.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Tiempo por pregunta (s):</strong></td>
              <td>{stats.avgTime.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      )}
    </div>
    <Footer />
    </>
    
  );
};

export default Stats;
