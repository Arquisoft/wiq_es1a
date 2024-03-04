// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8004;


app.use(bodyParser.json());
app.use(cors());

app.set("json spaces", 40);

app.post("/saveGame", async (req, res) => {
  try {
    const { username, correctAnswers, incorrectAnswers, points, avgTime } = req.body;

    // Hacer una solicitud al servicio user-service para guardar el juego
    const response = await axios.post('http://localhost:8001/userSaveGame', {
      username,
      correctAnswers,
      incorrectAnswers,
      points,
      avgTime
    });

    res.json(response.data);
    };

    user.games.push(newGame);

    await user.save();

    res.json({ message: "Juego guardado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener estadísticas
app.get("/stats", async (req, res) => {
  try {
    const username = req.query.user;

    // Hacer una solicitud al servicio user-service para obtener estadísticas
    const response = await axios.get(`http://localhost:8001/getstats?user=${username}`);

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: `Error al obtener las estadísticas: ${error.message}`});
  }
});



const server = app.listen(port, () => {
  console.log(`Stats Service listening at http://localhost:${port}`);
});
  
module.exports = server;