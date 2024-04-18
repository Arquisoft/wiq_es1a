// user-service.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { User, Group } = require("./user-model");

const app = express();
const port = 8001;

const cors = require("cors");

const corsOptions = {
  origin: [
    process.env.AUTH_SERVICE_URL || "http://localhost:8000",
    process.env.USER_SERVICE_URL || "http://localhost:8001",
    process.env.QUESTION_SERVICE_URL || "http://localhost:8002",
    process.env.STATS_SERVICE_URL || "http://localhost:8003",
    process.env.GATEWAY_SERVICE_URL || "http://localhost:8004",
    process.env.MONGODB_URI || "mongodb://localhost:27017/userdb",
    process.env.MONGODB_STATS_URI || "mongodb://localhost:27017/statsdb",
  ],
};

app.use(cors(corsOptions));

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/userdb";
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
  if (typeof input !== "string") {
    throw new Error("Input debe ser una cadena de texto");
  }
  return input.trim();
}

app.post("/adduser", async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ["username", "password"]);

    const username = req.body.username;

    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res
        .status(400)
        .json({
          error: "Username already exists. Please choose a different username.",
        });
    }

    // Encrypt the password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      username: newUser.username,
      createdAt: newUser.createdAt,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/search", async (req, res) => {
  try {
    const { username } = req.query;
    // Encuentra al usuario actual
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Encuentra los amigos del usuario actual
    const un = username;
    const currentUserFriends = currentUser.friends;

    // Encuentra todos los usuarios que no son amigos del usuario actual
    const users = await User.find({
      username: { $ne: un, $nin: currentUserFriends },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users/add-friend", async (req, res) => {
  try {
    const username = req.body.username;
    const friendUsername = req.body.friendUsername;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user)
    if (user.friends.includes(friendUsername)) {
      return res.status(400).json({ error: "Friend already added" });
    }

    user.friends.push(friendUsername);
    await user.save();

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    friend.friends.push(username);
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users/remove-friend", async (req, res) => {
  try {
    const username = req.body.username;
    const friendUsername = req.body.friendUsername;

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar si el amigo está en la lista de amigos del usuario
    if (!user.friends.includes(friendUsername)) {
      return res
        .status(400)
        .json({ error: "Friend not found in the user's friend list" });
    }

    // Eliminar al amigo de la lista de amigos del usuario
    user.friends = user.friends.filter((friend) => friend !== friendUsername);
    await user.save();

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar si el amigo está en la lista de amigos del usuario
    if (!friend.friends.includes(username)) {
      return res
        .status(400)
        .json({ error: "Friend not found in the user's friend list" });
    }

    // Eliminar al amigo de la lista de amigos del usuario
    friend.friends = friend.friends.filter((friend) => friend !== username);
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get friends of the authenticated user
app.get("/friends", async (req, res) => {
  try {
    const username = checkInput(req.query.user);

    // Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ username:username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Devuelve la lista de amigos
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/userInfo/:user", async (req, res) => {
  try {
    const username = req.params.user;
    if(!username || typeof username !== "string" || username.trim() === ""){
      throw new Error("Input debe ser una cadena de texto");
    }
    const user = await User.findOne(
      { username: username }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/userGames", async (req, res) => {
  try {
    const username = req.query.user;
    if(!username){
      return res.status(400).json({ error: "Nombre inválido" });
    }
    const user = await User.findOne({ username:
      username,
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user.games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/saveGameList", async (req, res) => {
  try {
    const username = checkInput(req.body.username);
    const gamemode = checkInput(req.body.gameMode);
    const gameData = req.body.gameData;
    const questions = req.body.questions;

    let user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const gameDataWithGamemode = { ...gameData, gamemode, questions };
    console.log(gameDataWithGamemode);
    user.games.push(gameDataWithGamemode);

    await user.save();

    res.status(200).json({ message: "Partida guardada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al guardar partida en la lista: " + error.message });
  }
});

app.get('/group/list', async (req, res) => {
  try {
      const allGroups = await Group.find();
      res.status(200).json({ groups: allGroups });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtener un grupo por su nombre
app.get('/group/:groupName', async (req, res) => {
  try {
      const groupName = req.params.groupName;
      const group = await Group.findOne({ name: groupName });

      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      res.status(200).json({ group });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


// Crear un nuevo grupo
app.post('/group/add', async (req, res) => {
  try {
      validateRequiredFields(req, ['name', 'username']);

      const name= checkInput(req.body.name);
      const username= checkInput(req.body.username);

      if (!name) {
        return res.status(400).json({ error: 'Group name cannot be empty' });
      }

      const existingGroup = await Group.findOne({ name: name });
      if (existingGroup) {
        return res.status(400).json({ error: 'Group name already exists' });
      }

      const user = await User.findOne({ username:username });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const newGroup = new Group({ name: name,
         members: [username],
          createdAt:Date.now() });
      await newGroup.save();

      res.status(200).json({ message: 'Group created successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Unirse a un grupo existente
app.post('/group/join', async (req, res) => {
  try {
      validateRequiredFields(req, ['groupId', 'username']);
      
      const groupId=req.body.groupId;
      const username=req.body.username;

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      if (group.members.includes(username)) {
          return res.status(400).json({ error: 'User already a member of this group' });
      }

      group.members.push(username);
      await group.save();

      res.status(200).json({ message: 'User joined the group successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on("close", () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;
