const express = require('express');

const Campground = require('../models/campground.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.get('/new', (req, res) => {
  res.render('campgrounds/new-campground');
});

router.get('/:id', async (req, res) => {
  const campgroundId = req.params.id;
  const campground = await Campground.findById(campgroundId);
  res.render('campgrounds/campground-details', { campground });
});

router.get('/:id/edit', async (req, res) => {
  const campgroundId = req.params.id;
  const campground = await Campground.findById(campgroundId);
  res.render('campgrounds/update-campground', { campground });
});

router.post('/', async (req, res) => {
  const { title, location } = req.body.campground;

  const campground = new Campground({ title, location });
  await campground.save();

  res.redirect(`/campgrounds/${campground._id}`);
});

router.put('/:id', async (req, res) => {
  const campgroundId = req.params.id;
  const { title, location } = req.body.campground;

  await Campground.findByIdAndUpdate(campgroundId, { title, location });

  res.redirect(`/campgrounds/${campgroundId}`);
});

module.exports = router;
