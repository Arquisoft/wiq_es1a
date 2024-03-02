import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';
import './Stats.css';


const Stats = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchStats = () => {
    setIsLoading(true);
    fetch(`http://localhost:8004/stats?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las preguntas:', error);
        setError(error.message || 'Ha ocurrido un error al obtener las estadísticas');
        setIsLoading(false);
      });
  };


  useEffect(() => {
    fetch(`http://localhost:8004/stats?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las preguntas:', error);
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
      <h2>Estadísticas de Usuario</h2>
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
      {stats && (
        <div>
          <hr></hr>
          <p><strong>Usuario: </strong>{stats.username}</p>
          <pre>   <strong>Juegos Jugados: </strong>{stats.nGamesPlayed}</pre>
          <pre>   <strong>Promedio de Puntos: </strong>{stats.avgPoints}</pre>
          <pre>   <strong>Puntos Totales: </strong>{stats.totalPoints}</pre>
          <pre>   <strong>Preguntas Correctas Totales: </strong>{stats.totalCorrectQuestions}</pre>
          <pre>   <strong>Preguntas Incorrectas Totales: </strong>{stats.totalIncorrectQuestions}</pre>
          <pre>   <strong>Ratio Correctas/Incorrectas: </strong>{stats.ratioCorrectToIncorrect}</pre>
          <hr></hr>
        </div>
      )}
    </div>
    <Footer />
    </>
    
  );
};

export default Stats;
