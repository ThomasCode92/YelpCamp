const { flashDataToSession } = require('../util/session-flash');

const User = require('../models/user.model');

function getRegister(req, res, next) {
  res.render('auth/register');
}

async function postRegister(req, res, next) {
  const { username, email, password } = req.body.auth;

  const user = new User({ username, email });

  try {
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, error => {
      if (!error) {
        const flashData = {
          status: 'success',
          message: 'Welcome to YelpCamp!',
        };

        flashDataToSession(req, flashData, () => {
          res.redirect('/campgrounds');
        });
      } else {
        next(error);
      }
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
}

function getLogin(req, res, next) {
  res.render('auth/login');
}

async function postLogin(req, res, next) {
  const redirectUrl = req.session.returnToUrl || '/campgrounds';

  const flashData = {
    status: 'success',
    message: 'Welcome back to YelpCamp!',
  };

  flashDataToSession(req, flashData, () => {
    res.redirect(redirectUrl);
  });
}

async function logout(req, res, next) {
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
}

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
