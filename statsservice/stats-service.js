// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Stats = require("./model/stats-model.js");
const mongoose = require("mongoose");

const app = express();
const port = 8004;

app.use(bodyParser.json());
app.use(cors());

app.set("json spaces", 40);

const mongoUri =
  process.env.MONGODB_STATS_URI || "mongodb://localhost:27017/statsdb";
mongoose.connect(mongoUri);

app.post("/saveGame", async (req, res) => {
  try {
    const username = req.body.username;
    const gamemode = req.body.gameMode;
    const gameData = req.body.gameData;

    if (
      gamemode == "clasico" ||
      gamemode == "bateria" ||
      gamemode == "calculadora"
    ) {
      // Buscar las estadísticas existentes del usuario y modo de juego
      let stats = await Stats.findOne({
        username: username,
        gamemode: gamemode,
      });
      if (!stats) {
        var ratioCorrect = 0;
        if (gameData.incorrectAnswers + gameData.correctAnswers > 0) {
          ratioCorrect =
            (gameData.correctAnswers /
              (gameData.incorrectAnswers + gameData.correctAnswers)) *
            100;
        }
        // Si no existen estadísticas, crear un nuevo documento
        stats = new Stats({
          username: username,
          gamemode: gamemode,
          nGamesPlayed: 1,
          avgPoints: gameData.points,
          totalPoints: gameData.points,
          totalCorrectQuestions: gameData.correctAnswers,
          totalIncorrectQuestions: gameData.incorrectAnswers,
          ratioCorrect: ratioCorrect,
          avgTime: gameData.avgTime,
        });
        await stats.save();
      } else {
        await Stats.updateOne(
          { username: username, gamemode: gamemode },
          {
            $inc: {
              nGamesPlayed: 1,
              totalPoints: gameData.points,
              totalCorrectQuestions: gameData.correctAnswers,
              totalIncorrectQuestions: gameData.incorrectAnswers,
            },
            $set: {
              avgPoints:
                (stats.avgPoints * stats.nGamesPlayed + gameData.points) /
                (stats.nGamesPlayed + 1),
              ratioCorrect:
                ((stats.totalCorrectQuestions + gameData.correctAnswers) /
                  (stats.totalIncorrectQuestions +
                    stats.totalCorrectQuestions +
                    gameData.incorrectAnswers +
                    gameData.correctAnswers)) *
                100,
              avgTime:
                (stats.avgTime * stats.nGamesPlayed + gameData.avgTime) /
                (stats.nGamesPlayed + 1),
            },
          }
        );
      }

      res.status(200).json({ message: "Partida guardada exitosamente" });
    }
  } catch (error) {
    res.status(400).json({ error: "Error al guardar juego" + error.message });
  }
});

app.get("/stats", async (req, res) => {
  try {
    var data = await Stats.findOne({
      username: req.query.username,
      gamemode: req.query.gamemode,
    });
    if (!data) {
      res.status(400).json({ error: "User not found" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al obtener las estadísticas:" + error.message });
  }
});

app.get("/ranking", async (req, res) => {
  try {
    let sortBy = req.query.filterBy;
    let gamemode = req.query.gamemode;

    var data = await Stats.find({ gamemode: gamemode })
      .sort(sortBy)
      .limit(10);

    if (data && data.length > 0) {
      data = data.map((stat) => ({
        username: stat.username,
        [sortBy]: stat[sortBy],
      }));
    } else {
      throw new Error("No se encontraron estadísticas");
    }

    res.status(200).json(data);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al obtener el ranking: " + error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Stats Service listening at http://localhost:${port}`);
});

server.on("close", () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;
