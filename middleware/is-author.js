const { flashDataToSession } = require('../util/session-flash');

const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

async function isCampgroundAuthor(req, res, next) {
  const userId = req.user._id;
  const campgroundId = req.params.id;

  const campground = await Campground.findById(campgroundId);

  if (!campground.author.equals(userId)) {
    const flashData = {
      status: 'error',
      message: 'You do not have permission to do that!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect(`/campgrounds/${campgroundId}`);
    });
  } else {
    next();
  }
}

async function isReviewAuthor(req, res, next) {
  const userId = req.user._id;
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);

  if (!review.author.equals(userId)) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;

    req.error = error;
  }

  next();
}

module.exports = { isCampgroundAuthor, isReviewAuthor };
