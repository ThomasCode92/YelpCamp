const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = joi => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });

        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });

        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().escapeHTML().required(),
    price: Joi.number().required().min(0.01),
    location: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().required(),
  }).required(),
  deleteImages: Joi.array(),
});

exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    text: Joi.string().escapeHTML().required(),
  }).required(),
});
