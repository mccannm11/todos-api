const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const fixtures = require('./fixtures');
const chai = require('chai');
const expect = chai.expect;

const requiresAuthentication = (method, path) => done => {
  request(app)[method](path)
    .set('accept', 'application/json')
    .set('x-access-token', '')
    .end( (err, res) => {
      expect(res.statusCode).to.equal(422);
      expect(res.body).to.be.an('array');
      done()
    })
}

describe('GET /api/todos', () => {
  it('requires authentication', requiresAuthentication('get' ,'/api/todos'));

  it('returns all todos for a user', (done) => {
    User.findOne({email: 'tim@huggins.com'}).exec((err, user) => {
      const token = user.generateJWT(user._id);
      request(app)
        .get('/api/todos')
        .set('accept', 'application/json')
        .set('x-access-token', token)
        .end( (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          done();
        })
    })
  });
});

describe('GET /api/todos/:id', () => {
  it('requires authentication', requiresAuthentication('get' ,'/api/todos/someidhere'));

  it('returns a single todo', (done) => {
    User.findOne({email: 'tim@huggins.com'}).exec((err, user) => {
      const id = user.todos[0]._id;
      const token = user.generateJWT(user._id);

      request(app)
        .get('/api/todos/' + id)
        .set('accept', 'application/json')
        .set('x-access-token', token)
        .end( (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.title).to.equal('testing123');
          expect(res.body).to.be.an('object');
          done();
        })
    })
  })
});

describe('POST /api/todos', () => {
  it('requires authentication', requiresAuthentication('post' ,'/api/todos'));

  it('returns creates a single todo', (done) => {
    User.findOne({email: 'tim@huggins.com'}).exec((err, user) => {
      const token = user.generateJWT(user._id);
      const data = {
        title: 'my new todo',
        completed: false
      }
      request(app).post('/api/todos/')
        .set('accept', 'application/json')
        .set('x-access-token', token)
        .send(data)
        .end( (err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('array');
          // warning: requires starting with 2 todos in fixtures
          expect(res.body.length).to.equal(3); 
          done();
        })
    })
  })
});

describe('DELETE /api/todos/:id', () => {
  it('requires authentication', requiresAuthentication('delete' ,'/api/todos/someidhere'));

  it('returns deletes a single todo', (done) => {
    User.findOne({email: 'tim@huggins.com'}).exec((err, user) => {
      const token = user.generateJWT(user._id);
      const id = user.todos[0]._id;

      request(app)
        .delete('/api/todos/' + id)
        .set('accept', 'application/json')
        .set('x-access-token', token)
        .end( (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          // warning: requires starting with 2 todos in fixtures
          expect(res.body.length).to.equal(1); 
          done();
        })
    })
  })
});

describe('PUT /api/todos/:id', () => {
  it('requires authentication', requiresAuthentication('put' ,'/api/todos/someidhere'));
  it('returns deletes a single todo', (done) => {
    User.findOne({email: 'tim@huggins.com'}).exec((err, user) => {
      const token = user.generateJWT(user._id);
      const id = user.todos[0]._id;
      const data = {
        completed: true,
        title: 'My new Title'
      }
      request(app)
        .put('/api/todos/' + id)
        .set('accept', 'application/json')
        .set('x-access-token', token)
        .send(data)
        .end( (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          // warning: requires starting with 2 todos in fixtures
          expect(res.body.length).to.equal(2);
          expect(res.body[0].completed).to.equal(true); 
          done();
        })
    })
  })
});