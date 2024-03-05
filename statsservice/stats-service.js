// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const StatsClasico = require("./model/stats_clasico_model");
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

    user.games.push(newGame);

    await user.save();

    res.json({ message: "Juego guardado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/saveGame", async (req, res) => {
  try{
    const username = req.body.username;
    const gamemode = req.body.gamemode;
    const gameData = req.body.gameData;

    if(gamemode==="clasico"){
      const stats = await StatsClasico.findOne({ username });

      if (!stats) {
        // Si no existen estadísticas, crear un nuevo documento
        stats = new StatsClasico({
          username: username,
          nGamesPlayed: 1,
          avgPoints: gameData.points,
          totalPoints: gameData.points,
          totalCorrectQuestions: gameData.correctAnswers,
          totalIncorrectQuestions: gameData.incorrectAnswers,
          ratioCorrectToIncorrect: gameData.correctAnswers / gameData.incorrectAnswers,
          avgTime: gameData.avgTime,
        });
      } else {
        stats = statsGetter.calculateNewStatsClasico(gameData);
      }

      await stats.save();
  
      res.json({ message: "Partida guardada exitosamente" });

    }
  }
   catch (error) {
    res.status(400).json({ error: "Error al actualizar estadísticas"});
  }
});

app.get("/stats", async (req, res) => {
  const gamemode = await StatsClasico.findOne({ gamemode:req.query.gamemode });
  if (!gamemode) {
    return res.status(404).json({ error: "Gamemode no encontrado" });
  }
  try {
    var data = await statsGetter.getStatsForUser(req.query.user,gamemode);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener las estadísticas" });
  }
});



const server = app.listen(port, () => {
  console.log(`Stats Service listening at http://localhost:${port}`);
});
  
module.exports = server;