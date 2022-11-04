const getReturnToUrl = require('../util/return-to-url');

function checkAuthStatus(req, res, next) {
  const { user } = req;

  getReturnToUrl(req);

  if (user) {
    res.locals.user = user;
  }

  next();
}

module.exports = checkAuthStatus;
