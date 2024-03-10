const axios = require('axios');

// Definir la función para realizar la solicitud
async function fetchQuestions() {
  const url = 'http://localhost:8003/questions';
  const params = {
    tematica: 'all',
    n: 100
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las preguntas:', error);
  }
}

// Exportar la función
module.exports = { fetchQuestions };
