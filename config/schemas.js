const Joi = require('joi');

exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0.01),
    image: Joi.number().required(),
    location: Joi.number().required(),
    description: Joi.number().required(),
  }).required(),
});

exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    text: Joi.string().required(),
  }).required(),
});
