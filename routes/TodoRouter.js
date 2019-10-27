import express from "express";
import TodoController from "../controllers/TodoController"
const { validationHandler, isAuthenticated, hasToken } = require("../helpers");

const router = express.Router();

router.get(
  "/",
  [hasToken],
  validationHandler,
  isAuthenticated,
  TodoController.readAll
);

router.get(
  "/:id",
  [hasToken],
  validationHandler,
  isAuthenticated,
  TodoController.readOne
);

router.post(
  "/",
  [hasToken],
  validationHandler,
  isAuthenticated,
  TodoController.create
);

router.delete(
  "/:id",
  [hasToken],
  validationHandler,
  isAuthenticated,
  TodoController.delete
);

router.put(
  "/:id",
  [hasToken],
  validationHandler,
  isAuthenticated,
  TodoController.update
);

export default router