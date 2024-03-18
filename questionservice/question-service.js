// user-service.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const GeneratorChooser = require("./questionGen/GeneratorChooser");

const app = express();
const port = 8003;
let generadoresCargados = false;

const gen = new GeneratorChooser();
const MAX_QUESTIONS = 10000;

// Middleware to parse JSON in request body
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors());

app.use((req, res, next) => {
  if (!generadoresCargados) {
    return res
      .status(500)
      .json({
        error:
          "Los generadores de preguntas aún no se han cargado. Por favor, inténtalo de nuevo más tarde.",
      });
  }
  next();
});

app.set("json spaces", 40);

app.get("/questions", async (req, res) => {
  if (req.query.n > MAX_QUESTIONS) {
    res
      .status(400)
      .json({ error: `El límite de preguntas son ${MAX_QUESTIONS}` });
  }
  try {
    var tematica = req.query.tematica ? req.query.tematica : "all";
    var n = req.query.n ? req.query.n : 10;
    var data = gen.getQuestions(tematica, n);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/questions", async (req, res) => {
  const { tematicas, n } = req.body.body;
  if (!n || n > MAX_QUESTIONS) {
    res
      .status(400)
      .json({ error: `El límite de preguntas son ${MAX_QUESTIONS}` });
    return;
  }
  try {
    const temas = tematicas ? JSON.parse(tematicas) : [];
    const tematicasValidas =
      temas.length !== 0
        ? temas
        : ["paises", "literatura", "cine", "arte", "programacion"];
    const cantidadPreguntas = parseInt(n, 10);
    const data = gen.getQuestionsPost(tematicasValidas, cantidadPreguntas);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, async () => {
  console.log(`Question Service listening at http://localhost:${port}`);
  gen
    .loadGenerators()
    .then(() => {
      console.log("Generators loaded successfully!");
      generadoresCargados = true;
    })
    .catch((error) => {
      console.error("Error al cargar los generadores de preguntas:", error);
    });
});

cron.schedule("0 3 * * *", async () => {
  await gen.loadGenerators();
});

module.exports = server;
