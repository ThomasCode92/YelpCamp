const express = require('express');

const catchAsync = require('../util/catchAsync');

const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  catchAsync(async (req, res, next) => {
    const campgroundId = req.params.campId;
    const { rating, text } = req.body.review;

    const newReview = { body: text, rating: parseInt(rating, 10) };

    const campground = await Campground.findById(campgroundId);
    const review = new Review(newReview);

    campground.reviews.push(review);

    await Promise.all([review.save(), campground.save()]);

    res.json({ message: 'Review created successfully' });
  })
);

module.exports = router;
