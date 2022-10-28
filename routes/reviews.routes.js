const express = require('express');

const validateReview = require('../middleware/validate-review');

const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, async (req, res, next) => {
  const campgroundId = req.params.campId;
  const { rating, text } = req.body.review;

  const newReview = { body: text, rating: parseInt(rating, 10) };

  try {
    if (req.error) throw req.error; // req.error is an ExpressError

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

router.delete('/:id', async (req, res, next) => {
  const campgroundId = req.params.campId;
  const reviewId = req.params.id;

  try {
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(campgroundId, {
      $pull: { reviews: reviewId },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log(error);

    const { statusCode = 500, message = 'Something went wrong!' } = error;
    res.status(statusCode).json({ message });
  }
});

module.exports = router;
