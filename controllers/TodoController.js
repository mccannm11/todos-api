const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { ensureUser } = require('../helpers');

exports = module.exports;

exports.readAll = (req, res) => {
  User.findOne().where({_id: req.user_id}).exec( (err, user) => {
    if (!ensureUser(err, user, res)) return;
    res.status(200).send(user.todos);
  });
}

exports.readOne = (req, res) => {
  User.findOne().where({_id: req.user_id}).exec( (err, user) => {
    if (!ensureUser(err, user, res)) return;
    res.status(200).send(user.todos.id({_id: req.params.id}));
  });
}

exports.create = (req, res) => {
  User.findOneAndUpdate(
    {_id: req.user_id},
    {$push: {todos: {title: req.body.title, completed: false}}},
    {new: true},
    (err, user) => {
      if (!ensureUser(err, user, res)) return;
      if (err) res.status(500).send('Error creating the todo');
      res.status(201).send(user.todos);
    }
  )
}

exports.delete = (req, res) => {
  User.findOne().where({_id: req.user_id}).exec( (err, user) => {
    if (!ensureUser(err, user, res)) return;

    const todo = user.todos.pull(req.params.id);
    if (!todo) return res.status(404).send('Todo Not Found.');

    user.save((err,user) => {
      if (err) return re.status(500).send('User could not be saved');
      return res.status(200).send(user.todos);
    })
  });
}

exports.update = (req, res) => {
  const { completed, title } = req.body;

  User.findOneAndUpdate(
    { '_id' : req.user_id, 'todos._id': req.params.id },
    { '$set': {
        'todos.$.title': title,
        'todos.$.completed': completed, }
    }, 
    { new: true },
    (err, user) => {
      if (err) return res.status(500).send('Todo could not be saved');
      return res.status(200).send(user.todos);
    }
  ); 
}
