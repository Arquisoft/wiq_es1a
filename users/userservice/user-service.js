// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./user-model');
const StatsForUser = require("./stats-getter.js");

const statsGetter= new StatsForUser();

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

    app.post("/userSaveGame", async (req, res) => {
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
    
        res.json({ message: "Partida guardada exitosamente" });
      } catch (error) {
        res.status(400).json({ error: "Error al guardar partida"});
      }
    });
    
    app.get("/getstats", async (req, res) => {
      const user = await User.findOne({ username:req.query.user });
    
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      try {
        var data = await statsGetter.getStatsForUser(req.query.user);
        res.json(data);
      } catch (error) {
        res.status(400).json({ error: "Error al obtener las estadísticas" });
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