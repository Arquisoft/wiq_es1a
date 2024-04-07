const express = require("express");
const axios = require("axios");
const cors = require("cors");
const promBundle = require("express-prom-bundle");
const YAML = require('yaml');
const fs = require("fs");
const swaggerUi = require('swagger-ui-express'); 
const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";
const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:8001";
const questionServiceUrl =
  process.env.QUESTION_SERVICE_URL || "http://localhost:8003";
const statsServiceUrl = process.env.STATS_SERVICE_URL || "http://localhost:8004";

app.use(cors());
app.use(express.json());

// Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.set("json spaces", 40);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

returnError = (res, error) => {
  console.log(error);
  res.status(error.response.status).json({ error: error.response.data.error });
}

// Function to handle forwarding requests
const forwardRequest = async (req, res, serviceUrl, endpoint) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${endpoint}`,
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    returnError(res, error);
  }
}

// Define routes with forwarding
app.post("/login", async (req, res) => {
  await forwardRequest(req, res, authServiceUrl, '/login');
});

app.post("/adduser", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/adduser');
});

app.get("/userInfo", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/userInfo');
});

app.post("/saveGameList", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/saveGameList');
});

app.get("/friends", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/friends');
});

app.get("/users/search", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/users/search');
});

app.post("/users/add-friend", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/users/add-friend');
});

app.post("/users/remove-friend", async (req, res) => {
  await forwardRequest(req, res, userServiceUrl, '/users/remove-friend');
});

app.get("/questions", async (req, res) => {
  await forwardRequest(req, res, questionServiceUrl, '/questions');
});

app.post("/questions", async (req, res) => {
  await forwardRequest(req, res, questionServiceUrl, '/questions');
});

app.get("/stats", async (req, res) => {
  await forwardRequest(req, res, statsServiceUrl, '/stats');
});

app.post("/saveGame", async (req, res) => {
  await forwardRequest(req, res, statsServiceUrl, '/saveGame');
});

app.get("/ranking", async (req, res) => {
  await forwardRequest(req, res, statsServiceUrl, '/ranking');
});

// Serve OpenAPI documentation if available
const openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = YAML.parse(file);
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;

