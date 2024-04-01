// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./user-model');

const app = express();
const port = 8001;

const cors = require('cors');
app.use(cors());

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

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        // Check if the username already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }

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
          const user = await User.findOne({username:req.query.user});
          res.json(user);
      } catch (error) {
          res.status(400).json({ error: error.message }); 
      }});

app.post("/saveGameList", async (req, res) => {
  try {
    const username = req.body.username;
    const gamemode = req.body.gameMode;
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