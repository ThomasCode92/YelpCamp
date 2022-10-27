const express = require('express');

const validateReview = require('../middleware/validate-review');

const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  const campgroundId = req.params.campId;

  try {
    const campground = await Campground.findById(campgroundId);

    await campground.populate('reviews');

    res.json({
      message: 'Reviews fetched successfully',
      data: campground.reviews,
    });
  } catch (error) {
    res.status(404).json({ message: 'Campground not found!' });
  }
});

router.post('/', validateReview, async (req, res, next) => {
  const campgroundId = req.params.campId;
  const { rating, text } = req.body.review;

  const newReview = { body: text, rating: parseInt(rating, 10) };

  try {
    if (req.error) throw req.error; // req.error is a ExpressError

    const campground = await Campground.findById(campgroundId);
    const review = new Review(newReview);

    campground.reviews.push(review);

    await Promise.all([review.save(), campground.save()]);

    res.json({ message: 'Review created successfully', data: review });
  } catch (error) {
    console.log(error);

    const { statusCode = 500, message = 'Something went wrong!' } = error;
    res.status(statusCode).json({ message });
  }
});

module.exports = router;
