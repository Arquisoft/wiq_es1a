import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Stats = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

  const [username, setUsername] = useState(localStorage.username);
  const [stats, setStats] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchRanking = () => {
    setIsLoading(true);
    fetch(gatewayUrl+`/ranking?gamemode=${gamemode}`)
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
    const delayDebounceFn = setTimeout(() => {
      fetchStats();
      fetchRanking();
      },2000);
  
      return () => clearTimeout(delayDebounceFn);
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
          <label htmlFor="usernameInput">Nombre de usuario: </label>
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
      <h2><em>Estadísticas de Usuario  - Modo {getModeName()}</em></h2>
      <label htmlFor="usernameInput"> <strong>Nombre de Usuario: </strong></label>
      <input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
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
      {stats === null && !isLoading && (
          <div>
            <p>El usuario no ha jugado ninguna partida.</p>
          </div>
        )}
        {stats && (
          <div>
            <h2>Estadísticas de usuario - Modo {getModeName()}</h2>
            <table>
            <tr>
              <td><strong>Usuario</strong></td>
              <td>{stats.username}</td>
            </tr>
            <tr>
              <td><strong>Partidas jugadas</strong></td>
              <td>{stats.nGamesPlayed}</td>
            </tr>
            <tr>
              <td><strong>Puntos por partida</strong></td>
              <td>{stats.avgPoints.toFixed(2)}</td>
             </tr>
            <tr>
              <td><strong>Puntos totales</strong></td>
              <td>{stats.totalPoints}</td>
            </tr>
            <tr>
              <td><strong>Preguntas correctas totales</strong></td>
              <td>{stats.totalCorrectQuestions}</td>
            </tr>
            <tr>
              <td><strong>Preguntas incorrectas totales</strong></td>
              <td>{stats.totalIncorrectQuestions}</td>
            </tr>
            <tr>
              <td><strong>Porcentaje de aciertos</strong></td>
              <td>{stats.ratioCorrect.toFixed(2)}%</td>
            </tr>
            <tr>
              <td><strong>Tiempo por pregunta (s):</strong></td>
              <td>{stats.avgTime.toFixed(2)}</td>
            </tr>
          </table>
          </div>
        )}
        {ranking && ranking.length > 0 && (
                <div>
                    <h2>Ranking - Modo {getModeName()}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Puntos promedio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.map((stat, index) => (
                                <tr key={index}>
                                    <td>{stat.username}</td>
                                    <td>{stat.avgPoints.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    </div>
    <Footer />
    </>
    
  );
}

export default Stats;

