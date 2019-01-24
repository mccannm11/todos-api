const jwt = require('jsonwebtoken');
const config = require('./config');
const { validationResult } = require('express-validator/check');
  
exports = module.exports;

exports.TOKEN_EXPIRATION = 24 * 60 * 60;

exports.isAuthenticated = (req,res,next) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
    });

    req.user_id = decoded.id;
    next();
  });
}


exports.validationHandler = (req, res, next) => _ => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
}