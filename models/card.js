'use strict';

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardName: {
    type: String,
    trim: true
  },
  cardImage: {
    type: String,
    trim: true
  },
  cardValue: {
    type: Number,
    trim: true
  },
  cardAmount: {
    type: Number,
    trim: true
  },
  cardApiId: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
