const express = require('express');

const { flashDataToSession } = require('../util/session-flash');

const authenticate = require('../middleware/authenticate');

const User = require('../models/user.model');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('auth/register');
});

router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body.auth;

  const user = new User({ username, email });

  try {
    await User.register(user, password);

    const flashData = {
      status: 'success',
      message: 'Welcome to YelpCamp!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect('/campgrounds');
    });
  } catch (error) {
    const flashData = {
      status: 'error',
      message: `${error.message}!`,
    };

    flashDataToSession(req, flashData, () => {
      res.redirect('/auth/register');
    });
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', authenticate, (req, res, next) => {
  const flashData = {
    status: 'success',
    message: 'Welcome back to YelpCamp!',
  };

  flashDataToSession(req, flashData, () => {
    res.redirect('/campgrounds');
  });
});

router.get('/logout', (req, res, next) => {
  req.logout(error => {
    if (error) return next(error);

    const flashData = {
      status: 'success',
      message: 'Goodbye!',
    };

    return flashDataToSession(req, flashData, () => {
      res.redirect('/campgrounds');
    });
  });
});

module.exports = router;
