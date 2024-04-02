// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./user-model');

const app = express();
const port = 8001;

const cors = require('cors');

const corsOptions = {
  origin: [
    process.env.AUTH_SERVICE_URL || "http://localhost:8000",
    process.env.USER_SERVICE_URL || "http://localhost:8001",
    process.env.QUESTION_SERVICE_URL || "http://localhost:8002",
    process.env.STATS_SERVICE_URL || "http://localhost:8003",
    process.env.GATEWAY_SERVICE_URL || "http://localhost:8004",
    process.env.MONGODB_URI || "mongodb://localhost:27017/userdb",
    process.env.MONGODB_STATS_URI || "mongodb://localhost:27017/statsdb"
  ],
};

app.use(cors(corsOptions));

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

function checkInput(input) {
  if (typeof input !== 'string') {
    throw new Error('Input debe ser una cadena de texto');
  }
  return input.trim();
};

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }});

app.get('/userInfo', async (req, res) => {
      try {
          const username = checkInput(req.query.user);
          const user = await User.findOne({username:username});
          res.json(user);
      } catch (error) {
          res.status(400).json({ error: error.message }); 
      }});

app.post("/saveGameList", async (req, res) => {
  try {
    const username = checkInput(req.body.username);
    const gamemode = checkInput(req.body.gameMode);
    const gameData = req.body.gameData;

      let user = await User.findOne({ username: username });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const gameDataWithGamemode = { ...gameData, gamemode };
      user.games.push(gameDataWithGamemode);

      await user.save();

      res.json({ message: "Partida guardada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al guardar partida en la lista: " + error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server