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
      avgTime: Number
    }],
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
