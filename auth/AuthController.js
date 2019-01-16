const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const TOKEN_EXPIRATION = 24 * 60 * 60;


router.post('/register', function(req, res) {
  
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log(req.body);
  
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  },
  (err, user) => {
    if (err) return res.status(500).send({ 
    	message: 'There was a problem registering the user.',
    	auth: false
    })

    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: TOKEN_EXPIRATION
    });

    res.status(200).send({
    	auth: true,
    	token: token
	});
  }); 
});

router.get('/me', (req, res) =>  {
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
    
    res.status(200).send(decoded);
  });
});

router.post('/login', function(req, res) {
  console.log(req.body)
  User.findOne({ email: req.body.email }).select('password').exec( (err, user) => {
    if (err) return res.status(500).send({
    	message: 'Error on the server.'
    });
    if (!user) return res.status(404).send({
    	message:'User not found.'
    });

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
    if (!passwordIsValid) return res.status(401).send({
    	auth: false,
    	token: null
    });
    
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: TOKEN_EXPIRATION
    });
    res.status(200).send({
    	auth: true,
    	token: token
    });
  });
});

module.exports = router;