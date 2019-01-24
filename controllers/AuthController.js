
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config.js');
const { validationResult, check } = require('express-validator/check');
const { validationHandler } = require('../helpers');
exports = module.exports;

exports.validate = (method) => {
  switch (method) {
      case 'register': {
        return [ 
          check('name')
            .not().isEmpty().withMessage('Username must not be empty.')
          check('email','Invalid Email').exists().isEmail(),
            .not().isEmpty().withMessage('Email must not be empty.')
          check('password','Invalid Email').exists().isEmail(),
            .not().isEmpty().withMessage('Password must not be empty.')
         ]
      }
      case 'me': {
        return [
          check('token')
            .not().isEmpty().withMessage('Token must not be blank'),
        ]
      }
      case 'login': {
        return [
          check('email')
            .not().isEmpty().withMessage('Email must not be empty.'),
          check('password')
            .not().isEmpty().withMessage('Password must not be empty.'),
        ]
      }
  }
}

exports.register = (req, res, next) => {
  const { name, email } = req.body;
  let user = new User();

  user.email = email;
  user.name = name;
  user.setPassword()

  user.save().then( (err, user) => {
    res.status(200).send({
      auth: true,
      token: user.generateToken()
    });
  }).catch(next);
}

exports.me = (req, res) => {
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({
      auth: false,
      message: 'Failed to authenticate token.'
    });
    
    res.status(200).send(decoded);
  });
}

exports.login = (req, res, next) => {
    req
     .getValidationResult()
     .then(validationHandler(req, res, next))
     .then( _ => {
        const { email, password } = req.body;

        User.findOne({ email: email }).select('password').then( (err,user) => {
          if (!user) return res.status(404).send({
            message:'User not found.'
          });

          if (user.validPassword(password)) return res.status(401).send({
            auth: false,
            token: null
          });
           
          res.status(200).send({
            auth: true,
            token: user.generateToken()
          });

        })
  }).catch(next);
}