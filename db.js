const mongoose = require('mongoose');
const node_env = process.env.NODE_ENV || 'dev';
let url = 'mongodb://localhost/todos-';

const options = { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.Promise = global.Promise;

module.exports = mongoose.connect(url + node_env, options);
