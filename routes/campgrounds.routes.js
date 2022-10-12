const express = require('express');

const Campground = require('../models/campground.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

module.exports = router;
