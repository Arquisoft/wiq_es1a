// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const StatsForUser = require("./model/stats-getter");
const User = require("../users/user-model.js");
const cors = require('cors');

const cron = require("node-cron");

const app = express();
const port = 8004;

const statsGetter = new StatsForUser();

app.use(bodyParser.json());
app.use(cors());

app.set("json spaces", 40);

app.post("/saveGame", async (req, res) => {
  try {
    const { username, correctAnswers, incorrectAnswers, points, avgTime } = req.body;

    // Encontrar al usuario en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear un nuevo juego
    const newGame = {
      correctAnswers,
      incorrectAnswers,
      points,
      avgTime
    };

    user.games.push(newGame);

    await user.save();

    res.json({ message: "Juego guardado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/stats", async (req, res) => {
  if (!statsGetter.existsUser(req.query.user)) {
    res
      .status(400)
      .json({ error: `El usuario no existe` });
  }
  try {
    var data = statsGetter.getStatsForUser(req.query.user);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, async() => {
    console.log(`Stats Service listening at http://localhost:${port}`);
    statsGetter.getStatsForUser(req.query.user)
    .then(() => {
      console.log("Stats loaded successfully!");
    })
    .catch((error) => {
      console.error("Error al cargar las estadísticas", error);
    });
  });

cron.schedule("0 3 * * *", async () => {
    await statsGetter.getStatsForUser(req.query.user);
  });
  
module.exports = server;