// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const StatsClasico = require("./model/stats-clasico-model.js");
const StatsForUser = require("./model/stats-getter.js");

const statsGetter= new StatsForUser();
const app = express();
const port = 8004;


app.use(bodyParser.json());
app.use(cors());

app.set("json spaces", 40);

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
    res.status(400).json({ error: "Error al guardar juego"+error.message});
  }
});

app.get("/stats", async (req, res) => {
  try {
    var data = await statsGetter.getStatsForUser(req.query.user,req.query.gamemode);
    res.json(data);
  } catch (error) {
    
    res.status(400).json({ error: "Error al obtener las estadísticas:"+error.message });
  }
});



const server = app.listen(port, () => {
  console.log(`Stats Service listening at http://localhost:${port}`);
});
  
module.exports = server;