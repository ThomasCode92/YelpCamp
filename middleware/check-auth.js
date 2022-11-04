function checkAuthStatus(req, res, next) {
  const { user } = req;

  if (user) {
    res.locals.user = user;
  }

  next();
}

module.exports = checkAuthStatus;
