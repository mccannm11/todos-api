const express = require('express');
const authController = require('../controllers/AuthController');
const router = express.Router();

router.post(
  '/register',
  authController.validate('register'),
  authController.register
);

router.get(
  '/me',
  authController.validate('me'),
  authController.me
);

router.post(
  '/login', 
  authController.validate('login'),
  authController.login
);

module.exports = router;