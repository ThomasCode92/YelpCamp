const express = require('express');

const catchAsync = require('../util/catchAsync');

const Campground = require('../models/campground.model');

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', (req, res) => {
  res.render('campgrounds/new-campground');
});

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const campground = await Campground.findById(campgroundId);
    res.render('campgrounds/campground-details', { campground });
  })
);

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    const campground = await Campground.findById(campgroundId);
    res.render('campgrounds/update-campground', { campground });
  })
);

router.post(
  '/',
  catchAsync(async (req, res) => {
    const { title, location, image, price, description } = req.body.campground;

    const campgroundData = { title, location, image, price, description };
    const campground = new Campground(campgroundData);

    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.put(
  '/:id',
  catchAsync(async (req, res, next) => {
    const campgroundId = req.params.id;
    const { title, location, image, price, description } = req.body.campground;

    const campgroundData = { title, location, image, price, description };

    await Campground.findByIdAndUpdate(campgroundId, campgroundData);
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const campgroundId = req.params.id;
    await Campground.findByIdAndDelete(campgroundId);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
