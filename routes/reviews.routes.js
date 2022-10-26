const express = require('express');

const catchAsync = require('../util/catchAsync');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  catchAsync(async (req, res, next) => {
    res.json({ message: 'Review created successfully' });
  })
);

module.exports = router;
