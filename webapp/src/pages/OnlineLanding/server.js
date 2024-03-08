const express = require("express");
const Game = require("./Game");
const Player = require("./Player");
const http = require("http");
const socketIo = require("socket.io");
const questions = require("./questions.json");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store rooms and games
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  // Unirse a una sala
  socket.on("joinRoom", (room, playerId, name) => {
    //Crear la entidad Jugador
    var player = new Player(playerId, name);
    var game = null;
    // Create room if not exists
    if (!rooms.has(room)) {
      game = new Game();
      rooms.set(room, new Game(room));
    } else {
      game = rooms.get(room);
    }
    //Add player to room
    game.players.add(player);
    io.to(room).emit("players", game.players);
  });

  socket.on("start", (roomId) => {
    var game = rooms.get(roomId);

    game.answers.push({
      pregunta: question.pregunta,
      respuestas: question.respuestas,
      correcta: question.correcta,
      respuestasUsuarios: [],
    });
    socket.to(roomId).emit("question", questions[game.round]);
    game.answers.push({
      pregunta: question.pregunta,
      respuestas: question.respuestas,
      correcta: question.correcta,
      respuestasUsuarios: [],
    });

    socket.on("submit", (userId, respuesta) => {
      var player = room.players.find((x) => x.id == userId);
      if (player) {
        var q = questions[game.round];
        game.answers.respuestasUsuarios.push({userId: userId, respuesta: respuesta, correcta: respuesta == q});
      }
      if (game.answers[i].respuestasUsuarios.length == game.players.size) {
        let question = questions[++game.round]
        socket.to(roomId).emit("question", question);
        game.answers.push({
          pregunta: question.pregunta,
          respuestas: question.respuestas,
          correcta: question.correcta,
          respuestasUsuarios: [],
        });
      }
    });
  });

  socket.on("ready", (roomId, playerId) => {
    let room = rooms.get(roomId);
    if (room) {
      let player = room.players.find((x) => x.id == playerId);
      if (player) {
        player.ready = true;
      }
    }
  });

  socket.on("notready", (roomId, playerId) => {
    let room = rooms.get(roomId);
    if (room) {
      let player = room.players.find((x) => x.id == playerId);
      if (player) {
        player.ready = false;
      }
    }
  });

  // Enviar mensaje a una sala
  socket.on("message", ({ room, message }) => {
    io.to(room).emit("message", message);
  });

  // Desconexión del usuario
  socket.on("disconnect", () => {
    rooms.forEach((users, room) => {
      if (users.delete(socket.id)) {
        console.log(`User ${socket.id} left room ${room}`);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
