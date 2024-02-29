const axios = require('axios');

// Definir la función para realizar la solicitud
async function fetchStats() {
  const url = 'http://localhost:8004/stats';
  const params = {
    user: 'user'
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las estadísticas:', error);
  }
}

// Exportar la función
module.exports = { fetchStats };