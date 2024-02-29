import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';

const Stats = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8004/stats?user=${username}`);
        setStats(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    if (username !== '') {
      fetchStats();
    }
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Nav />
    <div>
      <h2>Estadísticas de Usuario</h2>
      <label htmlFor="usernameInput">Nombre de Usuario: </label>
      <input
        type="text"
        id="usernameInput"
        value={username}
        onChange={handleUsernameChange}
      />
      {stats && (
        <div>
          <p>Usuario: {stats.username}</p>
          <p>Juegos Jugados: {stats.nGamesPlayed}</p>
          <p>Promedio de Puntos: {stats.avgPoints}</p>
          <p>Puntos Totales: {stats.totalPoints}</p>
          <p>Preguntas Correctas Totales: {stats.totalCorrectQuestions}</p>
          <p>Preguntas Incorrectas Totales: {stats.totalIncorrectQuestions}</p>
          <p>Ratio Correctas/Incorrectas: {stats.ratioCorrectToIncorrect}</p>
        </div>
      )}
    </div>
    <Footer />
    </>
    
  );
};

export default Stats;
