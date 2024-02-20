// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const StatsForUser = require("./stats-getter");

const app = express();
const port = 8004;

const statsGetter = new StatsForUser();

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.set("json spaces", 40);

app.get("/stats", async (req, res) => {
  if (!statsGetter.existsUser(req.query.username)) {
    res
      .status(400)
      .json({ error: `El usuario no existe` });
  }
  try {
    var data = statsGetter.getStatsForUser(req.query.username);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
  });
  
module.exports = server;