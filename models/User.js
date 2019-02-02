const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config.js');
const { TOKEN_EXPIRATION } = require('../helpers.js');

const UserSchema = new mongoose.Schema({  
  name: String,
  email: { type: String, index: {unique: true}},
  password: {type: String, select: false},
  todos: [{
    title: { type: String, default: '' },
    completed: { type: Boolean, default: false }
  }]
});

UserSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = () => {
  return jwt.sign({ 
    id: this._id,
    expiredIn: TOKEN_EXPIRATION
  },
  config.token
  );
};

UserSchema.methods.setPassword = (password) => {
  this.password = bcrypt.hashSync(password, 8);
};

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
