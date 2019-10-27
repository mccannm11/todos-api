import { handleMongooseError } from "../helpers";
import User from "../models/User";

const AuthController = {};

AuthController.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = new User({ name, email });
  await user.setPassword(password);

  try {
    user = await user.save();
  } catch (error) {
    handleMongooseError(error, res);
    return;
  }

  res.status(201).send({
    auth: true,
    token: user.generateJWT(user._id)
  });
};

AuthController.me = async (req, res) => {
  let user;

  try {
    user = await User.findOne()
      .where({ _id: req.user_id })
      .exec();
  } catch (error) {
    handleMongooseError(error, res);
  }

  res.status(200).send(user);
};

AuthController.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne()
      .where({ email: email })
      .select({ password: 1 })
      .exec();
  } catch (error) {
    handleMongooseError(error, res);
    return;
  }

  if (!user.checkPassword(password)) {
    return res.status(401).send({
      auth: false,
      token: null
    });
  }

  res.status(200).send({
    auth: true,
    token: user.generateJWT(user._id)
  });
};

export default AuthController;
