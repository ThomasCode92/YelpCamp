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

router.get('/register', getRegister);

router.post('/register', postRegister);

router.get('/login', getLogin);

router.post('/login', authenticate, postLogin);

router.get('/logout', logout);

module.exports = router;
