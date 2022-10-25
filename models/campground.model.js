const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = model('Campround', CampgroundSchema);
