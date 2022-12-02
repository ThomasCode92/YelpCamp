const mongoose = require('mongoose');

const Review = require('./review.model');

const { Schema, model } = mongoose;

const options = { toJSON: { virtuals: true } };

function createThumbnail() {
  return this.url.replace('/upload', '/upload/w_200');
}

function createPopupMarkup() {
  return `
    <strong><a href=/campgrounds/${this._id}>${this.title}</a></strong>
    <p>${this.description.substring(0, 50)}...</p>
  `;
}

async function deleteReviews(doc) {
  if (!doc) return;
  await Review.deleteMany({ _id: { $in: doc.reviews } });
}

const ImageSchema = new Schema({ url: String, filename: String });

const CampgroundSchema = new Schema(
  {
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
  },
  options
);

ImageSchema.virtual('thumbnail').get(createThumbnail);
CampgroundSchema.virtual('properties.popupMarkup').get(createPopupMarkup);
CampgroundSchema.post('findOneAndDelete', deleteReviews);

module.exports = model('Campround', CampgroundSchema);
