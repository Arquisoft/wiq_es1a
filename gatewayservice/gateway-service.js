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

//Prometheus configuration
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

app.post("/login", async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl + "/login", req.body);
    res.json(authResponse.data);
  } catch (error) {
    returnError(res, error);
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
    returnError(res, error);
  }
});

const handleRequest = async (req, res, serviceUrl) => {
  try {
    const response = await axios.get(serviceUrl, { params: req.query });
    res.json(response.data);
  } catch (error) {
    returnError(res, error);
  }
}

app.get('/userInfo/:user', async (req, res) => {
  try {
    const user = req.params.user;
    const userResponse = await axios.get(`${userServiceUrl}/userInfo/${user}`);
    res.json(userResponse.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/friends", async (req, res) => {
  handleRequest(req, res, userServiceUrl + "/friends");
});

app.get("/userGames", async (req, res) => {
  handleRequest(req, res, userServiceUrl + "/userGames");
});

app.post("/saveGameList", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      userServiceUrl + "/saveGameList",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.post("/group/add", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      userServiceUrl + "/group/add",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.post("/group/join", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      userServiceUrl + "/group/join",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.get("/group/list", async (req, res) => {
  try {
    // Forward the question request to the user service
    const userResponse = await axios.get(
      userServiceUrl + "/group/list",
      { params: req.query }
    );
    res.json(userResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.get('/group/:groupName', async (req, res) => {
  try {
    const groupName = req.params.groupName;
    const userResponse = await axios.get(`${userServiceUrl}/group/${groupName}`);
    res.json(userResponse.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/search", async (req, res) => {
  try {
    // Forward the question request to the user service
    const userResponse = await axios.get(
      userServiceUrl + "/users/search",
      { params: req.query }
    );
    res.json(userResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.post("/users/add-friend", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      userServiceUrl + "/users/add-friend",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

app.post("/users/remove-friend", async (req, res) => {
  try {
    // Forward the save game request to the stats service
    const gameResponse = await axios.post(
      userServiceUrl + "/users/remove-friend",
      req.body
    );
    res.json(gameResponse.data);
  } catch (error) {
    returnError(res, error);
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
    returnError(res, error);
  }
});

app.post("/questions", async (req, res) => {
  try {
    // Forward the question request to the question service
    const questionResponse = await axios.post(
      questionServiceUrl + "/questions",
      { body: req.body }
    );
    res.json(questionResponse.data);
  } catch (error) {
    returnError(res, error);
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
    returnError(res, error);
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
    returnError(res, error);
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const statsResponse = await axios.get(statsServiceUrl + "/ranking", {
      params: req.query,
    });
    res.json(statsResponse.data);
  } catch (error) {
    returnError(res, error);
  }
});

openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;
