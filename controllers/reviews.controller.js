const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

async function createReview(req, res, next) {
  const campgroundId = req.params.campId;
  const { rating, text } = req.body.review;

  const newReview = { body: text, rating: parseInt(rating, 10) };

  try {
    if (req.error) throw req.error; // req.error is an ExpressError

    if (!req.user) {
      const error = new Error('Not authenticated!');
      error.statusCode = 401;

      throw error;
    }

    const userId = req.user._id;
    const campground = await Campground.findById(campgroundId);
    const review = new Review(newReview);

    review.author = userId;
    campground.reviews.push(review);

    await Promise.all([review.save(), campground.save()]);
    await review.populate('author', 'username');

    res.json({ message: 'Review created successfully', data: review });
  } catch (error) {
    console.log(error);

    const { statusCode = 500, message = 'Something went wrong!' } = error;
    res.status(statusCode).json({ message });
  }
}

async function deleteReview(req, res, next) {
  const campgroundId = req.params.campId;
  const reviewId = req.params.id;

  try {
    if (req.error) throw req.error;

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
}

module.exports = { createReview, deleteReview };
