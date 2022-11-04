const passport = require('passport');

const { flashDataToSession } = require('../util/session-flash');

// More info: https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
// Passport Session issue: https://github.com/jaredhanson/passport/issues/904
function authenticate(req, res, next) {
  return passport.authenticate('local', (err, user) => {
    const { flashedData, returnToUrl } = req.session;

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

      // Keep initial Session data (see comment above)
      req.session.flashedData = flashedData;
      req.session.returnToUrl = returnToUrl;

      return req.session.save(() => next());
    });
  })(req, res, next);
}

module.exports = authenticate;
