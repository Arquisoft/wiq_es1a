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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User