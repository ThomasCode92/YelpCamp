const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = model('Review', ReviewSchema);
