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

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users/search', async (req, res) => {
  try {
    const searchTerm = req.query.search; // Obtener el término de búsqueda de la consulta de la URL
    const users = await User.find({ username: { $regex: searchTerm, $options: 'i' } }); // Realizar la búsqueda en la base de datos
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/add-friend', async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Buscar el usuario por userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Buscar el amigo por friendId
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Verificar si el amigo ya está en la lista de amigos del usuario
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Friend already added' });
    }

    // Agregar el amigo a la lista de amigos del usuario
    user.friends.push(friendId);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to get user ID from username
async function getUserIdFromUsername(username) {
  try {
    // Find the user by username in the database
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    // Return the user ID
    return user._id;
  } catch (error) {
    throw new Error('Error getting user ID from username: ' + error.message);
  }
}

// Route to get friends of the authenticated user
app.get('/users/friends/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Obtén el ID de usuario del nombre de usuario
    const userId = await getUserIdFromUsername(username);

    // Busca al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Popula la lista de amigos del usuario
    await user.populate('friends').execPopulate();

    // Devuelve la lista de amigos
    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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