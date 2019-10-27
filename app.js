import express from "express";
import db from "./db";
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import ApiRouter from "./routes/index";

const logger = (req, res, next) => {
  next();
};

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger);

app.use(expressValidator());

app.use("/api", ApiRouter);

module.exports = app;
