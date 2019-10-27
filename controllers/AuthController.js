const User = require("../models/User");
exports = module.exports;

const handleMongooseError = res => error => {
  if (error.name === "MongoError") {
    res.status(422).send("Invalid");
  } else {
    res.status(500).send("There was a fatal error");
  }
};

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = new User({ name, email });
  await user.setPassword(password);

  try {
    user = await user.save();
  } catch (error) {
    handleMongooseError(error);
  }

  res.status(201).send({
    auth: true,
    token: user.generateJWT(user._id)
  });
};

exports.me = async (req, res) => {
  let user;

  try {
    user = await User.findOne()
      .where({ _id: req.user_id })
      .exec();
  } catch (error) {
    handleMongooseError(error);
  }

  res.status(200).send(user);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne()
    .where({ email: email })
    .select({ password: 1 })
    .exec()
    .then(user => {
      if (!user.checkPassword(password))
        return res.status(401).send({
          auth: false,
          token: null
        });

      res.status(200).send({
        auth: true,
        token: user.generateJWT(user._id)
      });
    })
    .catch(handleMongooseError(res));
};
