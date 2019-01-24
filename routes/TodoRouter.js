const express = require('express');
const todoController = require('../controllers/TodoController');
const { isAuthenticated } = require('../helpers');
const router = express.Router();


router.get('/', 
  isAuthenticated,
  todoController.readAll
);

router.get('/:id',
  isAuthenticated,
  todoController.readOne
);

router.post('/',
  isAuthenticated,
  todoController.create
);

router.delete('/:id',
  isAuthenticated,
  todoController.delete
);

router.put('/:id',
  isAuthenticated,
  todoController.update
);

module.exports = router;