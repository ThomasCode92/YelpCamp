const express = require('express');

const validateReview = require('../middleware/validate-review');
const catchAsync = require('../util/catchAsync');

const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res, next) => {
    const campgroundId = req.params.campId;
    const { rating, text } = req.body.review;

    if (!req.error) {
      const newReview = { body: text, rating: parseInt(rating, 10) };

      const campground = await Campground.findById(campgroundId);
      const review = new Review(newReview);

      campground.reviews.push(review);

      await Promise.all([review.save(), campground.save()]);

      res.json({ message: 'Review created successfully' });
    } else {
      // Error comes from validateReview middleware
      const { statusCode, message } = req.error;
      res.status(statusCode).json({ message });
    }
  })
);

module.exports = router;
