import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';
import './Stats.css';


const Stats = () => {
  const [username, setUsername] = useState(localStorage.username);
  const [stats, setStats] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchStats = () => {
    setIsLoading(true);
    fetch(`http://localhost:8004/stats?user=${username}?gamemode=${gamemode}`)
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
    fetch(`http://localhost:8004/stats?user=${username}?gamemode=${gamemode}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las estadisticas:', error);
        setIsLoading(false);
      });
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  
  const handleSearch = () => {
    if (username.trim() !== '') {
      fetchStats();
    }
  };

  if (isLoading) {
    return  <div>
              <h2> Cargando ... </h2>
              <p>Se está consultando su búsqueda, espere unos instantes.</p>
            </div>
  }

  if (error) {
    return  <>
        <Nav />
        <div>
            <label htmlFor="usernameInput">Nombre de Usuario: </label>
              <input
                  type="text"
                  id="usernameInput"
                  value={username}
                  onChange={handleUsernameChange}
              />
              <button onClick={handleSearch}>Buscar</button>
              <h2>Error: {error}</h2>
              <p>Por favor compruebe si los valores del formulario son correctos e inténtelo de nuevo</p>
            </div>
            <Footer />
            </>
  }

  return (
    <>
    <Nav />
    <div>
      <h2><em>Estadísticas de Usuario</em></h2>
      <label htmlFor="usernameInput"> <strong>Nombre de Usuario: </strong></label>
      <input
        type="text"
        id="usernameInput"
        value={username}
        onChange={handleUsernameChange}
      />
      <button onClick={handleSearch}>Buscar</button>
      {stats === null && !isLoading && (
          <div>
            <p>El usuario no ha jugado ninguna partida.</p>
          </div>
        )}
        {stats && gamemode === "clasico" && (
          <div>
            <h2><em>Estadísticas de Usuario - Modo Clásico</em></h2>
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
