import express from "express";
import AuthController from "../controllers/AuthController";
import { check } from "express-validator/check";
import { validationHandler, isAuthenticated } from "../helpers";

const router = express.Router();

router.post(
  "/register",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Username must not be empty."),
    check("email")
      .exists()
      .isEmail()
      .not()
      .isEmpty()
      .withMessage("Email must not be empty."),
    check("password")
      .exists()
      .withMessage("Password must Exist")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long")
  ],
  validationHandler,
  AuthController.register
);

router.get(
  "/me",
  [
    check("x-access-token")
      .exists()
      .withMessage("Token must Exist")
      .isLength({ min: 1 })
      .withMessage("Password must not be blank")
  ],
  validationHandler,
  isAuthenticated,
  AuthController.me
);

router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email must not be empty."),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password must not be empty.")
  ],
  validationHandler,
  AuthController.login
);

export default router