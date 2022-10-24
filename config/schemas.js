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
