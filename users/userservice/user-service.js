// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Group, User, UserGroup } = require('./user-model');

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
    const { username } = req.query;
    // Encuentra al usuario actual
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Encuentra los amigos del usuario actual
    const currentUserFriends = currentUser.friends;

    // Encuentra todos los usuarios que no son amigos del usuario actual
    const users = await User.find({ username: { $ne: username, $nin: currentUserFriends } });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/add-friend', async (req, res) => {
  try {
    const username = req.body.username;
    const friendUsername = req.body.friendUsername;

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ username:username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar si el amigo ya está en la lista de amigos del usuario
    if (user.friends.includes(friendUsername)) {
      return res.status(400).json({ error: 'Friend already added' });
    }

    // Agregar al amigo a la lista de amigos del usuario
    user.friends.push(friendUsername);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get friends of the authenticated user
app.get('/friends', async (req, res) => {
  try {
    const  username  = req.query.user;

    // Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }
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

app.get('/group/list', async (req, res) => {
  try {
      const allGroups = await Group.find();
      res.json({ groups: allGroups });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtener un grupo por su nombre
app.get('/group/:name', async (req, res) => {
  try {
      const groupName = req.params.name;
      const group = await Group.findOne({ name: groupName });

      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      const groupUsers = await UserGroup.find({ group: group._id }).populate('user');

      res.json({ group, users: groupUsers });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Crear un nuevo grupo
app.post('/group/add', async (req, res) => {
  try {
      const { name, userId } = req.body;

      // Verifica si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Crea un nuevo grupo
      const newGroup = new Group({ name });
      await newGroup.save();

      // Agrega al usuario como miembro del grupo
      const userGroup = new UserGroup({ user: userId, group: newGroup._id });
      await userGroup.save();

      res.json({ message: 'Group created successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Unirse a un grupo existente
app.post('/group/join', async (req, res) => {
  try {
      const { groupId, userId } = req.body;

      // Verifica si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Verifica si el grupo existe
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Verifica si el usuario ya es miembro del grupo
      const existingMembership = await UserGroup.findOne({ user: userId, group: groupId });
      if (existingMembership) {
          return res.status(400).json({ error: 'User already a member of this group' });
      }

      // Agrega al usuario como miembro del grupo
      const userGroup = new UserGroup({ user: userId, group: groupId });
      await userGroup.save();

      res.json({ message: 'User joined the group successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
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