const express = require("express");
const app = express();
const db = require("./db");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");

const logger = (req, res, next) => {
  // code for logging here
  next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger);

app.use(expressValidator());

const apiRouter = require("./routes/index");
app.use("/api", apiRouter);

module.exports = app;
