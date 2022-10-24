const { campgroundSchema } = require('../config/schemas');

const ExpressError = require('../util/ExpressError');

const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);

  if (result.error) {
    console.log(result.error.details);
    throw new ExpressError('Invalid Campground Data', 500);
  }

  next();
};

module.exports = validateCampground;
