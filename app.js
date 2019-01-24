const express = require('express');
const app = express();
const db = require('./db');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());

const apiRouter = require('./routes/index');
app.use('/api', apiRouter);

module.exports = app;