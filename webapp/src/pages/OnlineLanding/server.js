const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        if (!rooms.has(roomId)) {
            rooms.set(roomId, []);
        }
        const players = rooms.get(roomId);
        players.push(socket.id);
        rooms.set(roomId, players);
        socket.join(roomId);
        io.to(roomId).emit('updatePlayers', players);
    });

    socket.on('answer', ({ roomId, playerId, optionIndex }) => {
        io.to(roomId).emit('answer', { playerId, optionIndex });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        rooms.forEach((players, roomId) => {
            const index = players.indexOf(socket.id);
            if (index !== -1) {
                players.splice(index, 1);
                io.to(roomId).emit('updatePlayers', players);
                if (players.length === 0) {
                    rooms.delete(roomId);
                }
            }
        });
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
