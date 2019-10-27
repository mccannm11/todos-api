const jwt = require("jsonwebtoken");
const config = require("./config");
const { validationResult, check } = require("express-validator/check");

exports = module.exports;

exports.TOKEN_EXPIRATION = 24 * 60 * 60;

exports.handleMongooseError = (error, res) => {
  if (error.name === "MongoError") {
    res.status(422).send("Invalid");
  } else {
    res.status(500).send("There was a fatal error");
  }
};

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res.status(401).send({
        auth: false,
        message: "Failed to authenticate token."
      });
    req.user_id = decoded.id;
    next();
  });
};

exports.validationHandler = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {
    next();
  }
};

exports.ensureUser = (user, res) => {
  if (!user) {
    res
      .status(404)
      .send("No user found.")
      .end();
    return false;
  }

  return true;
};

exports.hasToken = check("x-access-token")
  .exists()
  .withMessage("Token must Exist")
  .isLength({ min: 1 })
  .withMessage("Token must not be blank");
