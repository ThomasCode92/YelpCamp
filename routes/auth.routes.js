const express = require('express');

const authenticate = require('../middleware/authenticate');

const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} = require('../controllers/auth.controller');

const router = express.Router();

router.route('/register').get(getRegister).post(postRegister);

router.route('/login').get(getLogin).post(authenticate, postLogin);

router.get('/logout', logout);

module.exports = router;
