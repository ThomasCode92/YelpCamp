const { flashDataToSession } = require('../util/session-flash');

const Campground = require('../models/campground.model');

async function isAuthor(req, res, next) {
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

module.exports = isAuthor;
