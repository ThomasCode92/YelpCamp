const { flashDataToSession } = require('../util/session-flash');

function protectRoute(req, res, next) {
  if (!req.isAuthenticated()) {
    const flashData = {
      status: 'error',
      message: 'You must be signed in!',
    };

    return flashDataToSession(req, flashData, () => {
      res.redirect(`/auth/login`);
    });
  }

  return next();
}

module.exports = protectRoute;
