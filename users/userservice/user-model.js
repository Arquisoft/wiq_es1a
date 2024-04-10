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
});

const Group = mongoose.model('Group', groupSchema);

// Modelo para la relación entre usuarios y grupos
const userGroupSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
  },
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = { User, Group, UserGroup };