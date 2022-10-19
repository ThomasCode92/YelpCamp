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
  const campground = new Campground({ ...req.body.campground });
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

router.put('/:id', async (req, res) => {
  const campgroundId = req.params.id;
  const { title, location } = req.body.campground;

  await Campground.findByIdAndUpdate(campgroundId, { title, location });

  res.redirect(`/campgrounds/${campgroundId}`);
});

router.delete('/:id', async (req, res) => {
  const campgroundId = req.params.id;
  await Campground.findByIdAndDelete(campgroundId);
  res.redirect('/campgrounds');
});

module.exports = router;
