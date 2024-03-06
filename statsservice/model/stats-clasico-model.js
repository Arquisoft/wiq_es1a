const mongoose = require('mongoose');

const statsClasicoSchema = new mongoose.Schema({
    username: {
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
    ratioCorrectToIncorrect: {
        type: Number,
        required: true,
    },
    avgTime: {
        type: Number,
        required: true,
      },
});

const StatsClasico = mongoose.model('StatsClasico', statsClasicoSchema);

module.exports = StatsClasico
