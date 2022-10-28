const { reviewSchema } = require('../config/schemas');

const ExpressError = require('../util/ExpressError');

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);

  if (result.error) {
    console.log(result.error.details);
    const error = new ExpressError('Invalid Review Data', 500);
    req.error = error;
  }

  next();
};

module.exports = validateReview;
