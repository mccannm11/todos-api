const express = require('express');
const authController = require('../controllers/AuthController');
const router = express.Router();
const { check } = require('express-validator/check');
const { validationHandler, isAuthenticated } = require('../helpers');

router.post(
  '/register',
  [ 
  check('name')
    .not().isEmpty().withMessage('Username must not be empty.'),
  check('email').exists().isEmail()
    .not().isEmpty().withMessage('Email must not be empty.'),
  check('password')
    .exists().withMessage('Password must Exist')
    .isLength({min: 6}).withMessage('Password must be 6 characters long')
  ],
  validationHandler,
  authController.register
);

router.get(
  '/me',
  [
  check('x-access-token')
    .exists().withMessage('Token must Exist')
    .isLength({min: 1}).withMessage('Password must not be blank')
  ],
  validationHandler,
  isAuthenticated,
  authController.me
);

router.post(
  '/login', 
   [
   check('email')
      .not().isEmpty().withMessage('Email must not be empty.'),
    check('password')
      .not().isEmpty().withMessage('Password must not be empty.')
    ],
  validationHandler,
  authController.login
);

module.exports = router;