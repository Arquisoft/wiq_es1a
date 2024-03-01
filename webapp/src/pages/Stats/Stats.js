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
    return  <div>
              <h2> Cargando ... </h2>
              <p>Se está consultando su búsqueda, espere unos instantes.</p>
            </div>
  }

  if (error) {
    return  <div>
            <label htmlFor="usernameInput">Nombre de Usuario: </label>
              <input
                  type="text"
                  id="usernameInput"
                  value={username}
                  onChange={handleUsernameChange}
              />

              <h2>Error: {error}</h2>
              <p>Por favor compruebe si los valores del formulario son correctos e inténtelo de nuevo</p>
            </div>;
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
