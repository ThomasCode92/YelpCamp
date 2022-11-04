function getReturnToUrl(req, action) {
  // store the url the user was requesting
  if (!['/auth/login', '/'].includes(req.originalUrl)) {
    req.session.returnToUrl = req.originalUrl;
  }

  req.session.save(action);
}

module.exports = getReturnToUrl;
