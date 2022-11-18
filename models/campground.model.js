const mongoose = require('mongoose');

const Review = require('./review.model');

const { Schema, model } = mongoose;

function createThumbnail() {
  return this.url.replace('/upload', '/upload/w_200');
}

async function deleteReviews(doc) {
  if (!doc) return;
  await Review.deleteMany({ _id: { $in: doc.reviews } });
}

const ImageSchema = new Schema({ url: String, filename: String });

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [ImageSchema],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

ImageSchema.virtual('thumbnail').get(createThumbnail);
CampgroundSchema.post('findOneAndDelete', deleteReviews);

module.exports = model('Campround', CampgroundSchema);
