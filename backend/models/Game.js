const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Não iniciado'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);