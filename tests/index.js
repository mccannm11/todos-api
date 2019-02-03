const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const fixtures = require('./fixtures');
const User = mongoose.model('User');
let server;

before((done) => {
  server = app.listen();
  done();
});

beforeEach((done) => {
  User.deleteMany({}, err => {
    user = new User(fixtures.users[0]);
    user.setPassword(fixtures.users[0].password);
    user.save((err) => {
      if (!err) done();
    })
  })
})

after( done => {
  server.close(done);
  mongoose.connection.close();
})

require('./authTests');
require('./todoTests');