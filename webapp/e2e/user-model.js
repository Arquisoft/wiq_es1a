const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    games: [{
      gamemode: String,
      correctAnswers: Number,
      incorrectAnswers: Number,
      points: Number,
      avgTime: Number,
      questions: [{
        pregunta: String,
        respuestas: [
          String,
          String,
          String,
          String
        ],
        correcta: String,
        respuesta: String
      }]
    }],
    friends: [{
      type: String,
      ref: 'User'
  }]
});

const User = mongoose.model('User', userSchema);

// Modelo para el grupo
const groupSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true // Asegura que no haya grupos con el mismo nombre
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  members: [{
    type: String,
    required: true
  }]
});

const Group = mongoose.model('Group', groupSchema);



module.exports = { User, Group };