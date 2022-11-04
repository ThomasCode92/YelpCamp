const express = require('express');

const { flashDataToSession } = require('../util/session-flash');
const catchAsync = require('../util/catchAsync');

const validateCampground = require('../middleware/validate-campground');
const protectRoute = require('../middleware/protect-route');

const Campground = require('../models/campground.model');

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', protectRoute, (req, res) => {
  res.render('campgrounds/new-campground');
});

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const campground = await Campground.findById(campgroundId)
      .populate('author')
      .populate('reviews');

    if (campground) {
      res.render('campgrounds/campground-details', { campground });
    } else {
      const flashData = {
        status: 'error',
        message: 'Cannot find requested campground!',
      };

      flashDataToSession(req, flashData, () => {
        res.redirect(`/campgrounds`);
      });
    }
  })
);

router.get(
  '/:id/edit',
  protectRoute,
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const campground = await Campground.findById(campgroundId);

    if (!campground) {
      const flashData = {
        status: 'error',
        message: 'Cannot find requested campground!',
      };

      flashDataToSession(req, flashData, () => {
        res.redirect(`/campgrounds`);
      });
    } else {
      res.render('campgrounds/update-campground', { campground });
    }
  })
);

router.post(
  '/',
  protectRoute,
  validateCampground,
  catchAsync(async (req, res) => {
    const { title, location, image, price, description } = req.body.campground;
    const userId = req.user._id;

    const campgroundData = { title, location, image, price, description };
    const campground = new Campground(campgroundData);

    campground.author = userId;
    await campground.save();

    const flashData = {
      status: 'success',
      message: 'Successfully created a new campground!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect(`/campgrounds/${campground._id}`);
    });
  })
);

router.put(
  '/:id',
  protectRoute,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const campgroundId = req.params.id;
    const { title, location, image, price, description } = req.body.campground;

    const campgroundData = { title, location, image, price, description };

    const campground = await Campground.findById(campgroundId);

    if (campground.author.equals(userId)) {
      // Update Campground...

      const flashData = {
        status: 'success',
        message: 'Successfully updated this campground!',
      };

      flashDataToSession(req, flashData, () => {
        res.redirect(`/campgrounds/${campgroundId}`);
      });
    } else {
      const flashData = {
        status: 'error',
        message: 'You do not have permission to do that!',
      };

      flashDataToSession(req, flashData, () => {
        res.redirect(`/campgrounds/${campgroundId}`);
      });
    }
  })
);

router.delete(
  '/:id',
  protectRoute,
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;

    await Campground.findByIdAndDelete(campgroundId);

    const flashData = {
      status: 'success',
      message: 'Successfully deleted a campground!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect('/campgrounds');
    });
  })
);

module.exports = router;
