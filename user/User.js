const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema({  
  name: String,
  email: { type: String, index: {unique: true}},
  password: {type: String, select: false},
  todos: [{
  	title: { type: String, default: '' },
  	completed: { type: Boolean, default: false }
  }]
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
