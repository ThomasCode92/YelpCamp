const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campround', CampgroundSchema);
