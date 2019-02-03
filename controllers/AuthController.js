const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config.js');
const { validationResult, check } = require('express-validator/check');
const { ensureUser } = require('../helpers');

exports = module.exports;

exports.register = (req, res, next) => {
  const { name, email, password } = req.body;
  let user = new User({name, email});
  user.setPassword(password);
  
  user.save().then( (user, err) => {
    res.status(201).send({
      auth: true,
      token: user.generateJWT(user._id)
    });
  }).catch(next);
}

exports.me = (req, res) => {
  const token = req.headers['x-access-token'];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({
      auth: false,
      message: 'Failed to authenticate token.'
    });
    User.findOne().where({_id: decoded.id}).exec((err, user) => {
      if (!user) return res.status(404).send({
        message:'User not found.'
      });
      res.send(user);
    })
  });
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({email: email}).select('password').then( (user, err) => {
    if (!ensureUser(err, user, res)) return;

    if (!user.validPassword(password)) return res.status(401).send({
      auth: false,
      token: null
    });
     
    res.status(200).send({
      auth: true,
      token: user.generateJWT(user._id)
    });
  })
}