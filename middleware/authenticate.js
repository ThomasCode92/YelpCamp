const passport = require('passport');

const { flashDataToSession } = require('../util/session-flash');

// More info: https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
function authenticate(req, res, next) {
  return passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const flashData = {
        status: 'error',
        message: 'Authentication failed!',
      };

      return flashDataToSession(req, flashData, () => {
        res.redirect('/auth/login');
      });
    }

    return req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }

      return next();
    });
  })(req, res, next);
}

module.exports = authenticate;
