const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    // Atributos de la partida
    correctAnswers: {
        type: Number,
        default: 0
    },
    incorrectAnswers: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
    avgTime: {
        type: Number,
        default: 0
    }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
