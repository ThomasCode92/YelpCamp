const express = require('express');

const catchAsync = require('../util/catchAsync');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('auth/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
  })
);

module.exports = router;
