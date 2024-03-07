const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Almacenar las salas de chat y los usuarios por sala
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  // Unirse a una sala
  socket.on('joinRoom', (room) => {
    // Crear la sala si no existe
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room).add(socket.id);
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Enviar mensaje a una sala
  socket.on('message', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  // Desconexión del usuario
  socket.on('disconnect', () => {
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
