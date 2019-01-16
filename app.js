const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./user/UserController');
app.use('/api/users', UserController);

const TodoController = require('./todo/TodoController');
app.use('/api/todos', TodoController);

const AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;