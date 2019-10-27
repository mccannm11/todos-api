import User from "../models/User";
import { handleMongooseError, ensureUser } from "../helpers";

const TodoController = {};

TodoController.readAll = async (req, res) => {
  let user;

  try {
    user = await User.findOne()
      .where({ _id: req.user_id })
      .exec();
  } catch (error) {
    handleMongooseError(error, res);
    return;
  }

  if (!ensureUser(user, res)) return;
  res.status(200).send(user.todos);
};

TodoController.readOne = async (req, res) => {
  let user;

  try {
    user = await User.findOne()
      .where({ _id: req.user_id })
      .exec();
  } catch (error) {
    handleMongooseError(error, res);
  }

  if (!ensureUser(user, res)) return;

  res.status(200).send(user.todos.id({ _id: req.params.id }));
};

TodoController.create = async (req, res) => {
  let user;

  try {
    user = await User.findOneAndUpdate(
      { _id: req.user_id },
      { $push: { todos: { title: req.body.title, completed: false } } },
      { new: true }
    );
  } catch (error) {
    handleMongooseError(error, res);
  }

  if (!ensureUser(user, res)) return;

  res.status(201).send(user.todos);
};

TodoController.delete = async (req, res) => {
  let user;

  try {
    user = await User.findOne()
      .where({ _id: req.user_id })
      .exec();
  } catch (error) {
    handleMongooseError(error, res);
  }
  if (!ensureUser(user, res)) return;

  const todo = user.todos.pull(req.params.id.split(","));
  if (!todo) return res.status(404).send("Todo Not Found.");

  try {
    user = await user.save();
  } catch (error) {
    handleMongooseError(error, res);
  }

  return res.status(200).send(user.todos);
};

TodoController.update = async (req, res) => {
  const { completed, title } = req.body;

  let user;
  try {
    user = await User.findOneAndUpdate(
      { _id: req.user_id, "todos._id": req.params.id },
      {
        $set: {
          "todos.$.title": title,
          "todos.$.completed": completed
        }
      },
      { new: true }
    );
  } catch (error) {
    handleMongooseError(error, res);
  }

  return res.status(200).send(user.todos);
};

export default TodoController;
