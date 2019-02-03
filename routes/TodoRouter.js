const express = require('express');
const router = express.Router();
const todoController = require('../controllers/TodoController');
const { check } = require('express-validator/check');
const { validationHandler, isAuthenticated, hasToken } = require('../helpers');

router.get('/',
  [
    hasToken
  ],
  validationHandler,
  isAuthenticated,
  todoController.readAll
);

router.get('/:id',
  [
    hasToken
  ],
  validationHandler,
  isAuthenticated,
  todoController.readOne
);

router.post('/',
  [
    hasToken
  ],
  validationHandler,
  isAuthenticated,
  todoController.create
);

router.delete('/:id',
  [
    hasToken
  ],
  validationHandler,
  isAuthenticated,
  todoController.delete
);

router.put('/:id',
  [
    hasToken
  ],
  validationHandler,
  isAuthenticated,
  todoController.update
);

module.exports = router;