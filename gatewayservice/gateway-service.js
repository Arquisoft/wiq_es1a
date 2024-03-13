const express = require("express");
const axios = require("axios");
const cors = require("cors");
const promBundle = require("express-prom-bundle");

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";
const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const questionServiceUrl =
  process.env.QUESTION_SERVICE_URL || "http://localhost:8003";
const statsServiceUrl = process.env.STATS_SERVICE_URL || "http://localhost:8004";

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.set("json spaces", 40);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/login", async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl + "/login", req.body);
    res.json(authResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

app.post("/adduser", async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(
      userServiceUrl + "/adduser",
      req.body
    );
    res.json(userResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

app.get("/questions", async (req, res) => {
  try {
    // Forward the question request to the question service
    const questionResponse = await axios.get(
      questionServiceUrl + "/questions",
      { params: req.query }
    );
    res.json(questionResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

app.get("/stats", async (req, res) => {
  try {
    // Forward the stats request to the stats service
    const statsResponse = await axios.get(statsServiceUrl + "/stats", {
      params: req.query,
    });
    res.json(statsResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

app.post("/saveGame", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      statsServiceUrl + "/saveGame",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const statsResponse = await axios.get(statsServiceUrl + "/ranking", {
      params: req.query,
    });
    res.json(statsResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;
