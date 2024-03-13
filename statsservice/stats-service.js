// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const Stats = require("./model/stats-model.js");
const StatsForUser = require("./model/stats-getter.js");
const mongoose = require('mongoose');

const statsGetter= new StatsForUser();
const app = express();
const port = 8004;

const URL = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";

app.use(bodyParser.json());
app.use(cors());

app.set("json spaces", 40);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/statsdb';
mongoose.connect(mongoUri);

app.post("/saveGame", async (req, res) => {
  try{
    const username = req.body.username;
    const gamemode = req.body.gameMode;
    const gameData = req.body.gameData;

    console.log(gamemode);
    if(gamemode=="clasico" || gamemode=="bateria"){
      var stats = await Stats.findOne({ username:username, gamemode: gamemode });
      console.log("guardando stats");
      console.log(stats);

      if (!stats) {
        // Si no existen estadísticas, crear un nuevo documento
        stats = new Stats({
          username: username,
          gamemode: gamemode,
          nGamesPlayed: 1,
          avgPoints: gameData.points,
          totalPoints: gameData.points,
          totalCorrectQuestions: gameData.correctAnswers,
          totalIncorrectQuestions: gameData.incorrectAnswers,
          ratioCorrect: (gameData.correctAnswers / (gameData.incorrectAnswers+gameData.correctAnswers))*100,
          avgTime: gameData.avgTime,
        });
      } else {
        stats = statsGetter.calculateStats(gameData);
      }
      console.log(stats);
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

app.get("/ranking", async (req, res) => {
  try {
    var data = await statsGetter.getRanking(req.query.gamemode);
    res.json(data);

  } catch (error) {
    
    res.status(400).json({ error: "Error al obtener el ranking: "+error.message });
  }
});



const server = app.listen(port, () => {
  console.log(`Stats Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});
  
module.exports = server;