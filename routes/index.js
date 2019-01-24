const authRouter = require('./authRouter');
const todoRouter = require('./todoRouter');

const express = require('express');
const router = express.Router();

router.use('/todos', todoRouter);
router.use('/auth', authRouter);

module.exports = router;
