import AuthRouter from "./AuthRouter";
import TodoRouter from "./TodoRouter";

const express = require("express");
const router = express.Router();

router.use("/todos", TodoRouter);
router.use("/auth", AuthRouter);

export default router