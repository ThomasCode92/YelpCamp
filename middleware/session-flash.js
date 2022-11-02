const { getSessionData } = require('../util/session-flash');

function sessionFlash(req, res, next) {
  const sessionData = getSessionData(req);

  let successMessage = null;
  let errorMessage = null;

  if (sessionData) {
    const { status, message } = sessionData;

    successMessage = status === 'success' ? message : null;
    errorMessage = status === 'error' ? message : null;
  }

  res.locals.success = successMessage;
  res.locals.error = errorMessage;

  next();
}

module.exports = sessionFlash;
