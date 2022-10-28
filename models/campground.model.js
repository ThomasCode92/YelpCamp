const mongoose = require('mongoose');

const Review = require('./review.model');

const { Schema, model } = mongoose;

async function deleteReviews(doc) {
  if (!doc) return;
  await Review.deleteMany({ _id: { $in: doc.reviews } });
}

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

CampgroundSchema.post('findOneAndDelete', deleteReviews);

module.exports = model('Campround', CampgroundSchema);
