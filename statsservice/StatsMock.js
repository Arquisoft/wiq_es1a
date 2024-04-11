const mongoose = require('mongoose');

const stats = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    gamemode: {
        type: String,
        required: true,
      },
    nGamesPlayed: {
        type: Number,
        required: true,
    },
    avgPoints: {
        type: Number,
        required: true,
    },
    totalPoints: {
        type: Number,
        required: true,
    },
    totalCorrectQuestions: {
      type: Number,
      required: true,
    },
    totalIncorrectQuestions: {
        type: Number,
        required: true,
    },
    ratioCorrect: {
        type: Number,
        required: true,
    },
    avgTime: {
        type: Number,
        required: true,
      },
});

const Stats = mongoose.model('Stats', stats);

module.exports = Stats
