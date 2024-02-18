// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const GeneratorChooser = require("./questionGen/GeneratorChooser");

const app = express();
const port = 8003;

const gen = new GeneratorChooser();
const MAX_QUESTIONS = 10000;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.set("json spaces", 40);

app.get("/randomQuestion", async (req, res) => {
  if (req.query.n > MAX_QUESTIONS) {
    res
      .status(400)
      .json({ error: `El límite de preguntas son ${MAX_QUESTIONS}` });
  }
  try {
    var data = await gen.getFamososQuestions(req.query.n);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, async () => {
  console.log(`Question Service listening at http://localhost:${port}`);
  gen.loadGenerators()
      .then(() => {
        console.log("Generators loaded successfully!");
      })
      .catch((error) => {
        console.error("Error al cargar los generadores de preguntas:", error);
      });
});

cron.schedule("0 3 * * *", async () => {
  await gen.loadGenerators();
});

module.exports = server;
