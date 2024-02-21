// user-service.js
const express = require("express");
const bodyParser = require("body-parser");
const StatsForUser = require("./model/stats-getter");

const app = express();
const port = 8004;

const statsGetter = new StatsForUser();

app.use(bodyParser.json());

app.set("json spaces", 40);

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

const server = app.listen(port, () => {
    console.log(`Stats Service listening at http://localhost:${port}`);
  });
  
module.exports = server;