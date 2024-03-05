const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Objeto para almacenar las salas en memoria
const rooms = {};

// Ruta para crear una nueva sala
app.get('/rooms/create', (req, res) => {
    const { name } = req.body;
    const roomId = generateRoomId();

    rooms[roomId] = { name, players: [], questions: [] };

    res.status(201).json({ roomId, name });
});

app.get('/rooms/info/:roomId', (req, res) => {
    const { roomId } = req.params;

    if (!rooms[roomId]) {
        res.status(404).json({ error: 'La sala no existe' });
    } else {
        const { name, players } = rooms[roomId];
        res.status(200).json({ name, players });
    }
});

app.get('/rooms/join/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { playerName } = req.query;

    if (!rooms[roomId]) {
        res.status(404).json({ error: 'La sala no existe' });
    } else {
        rooms[roomId].players.push(playerName);
        res.status(200).json({ message: `${playerName} se ha unido a la sala ${roomId}` });
        console.log(`${playerName} se ha unido a la sala ${roomId}`)
    }
});

// Función para generar un ID de sala único
function generateRoomId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
