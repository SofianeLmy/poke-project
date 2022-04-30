'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },

  age: {
    type: Number,
    trim: true
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  passwordHashAndSalt: {
    type: String
  }
});

const User = mongoose.model('User', schema);

module.exports = User;
