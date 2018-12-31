const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config.js')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('../user/User');


const EnsureUser = (err, user, res) => {
    if (err) return res.status(500).send('There was a problem finding the user.');
    if (!user) return res.status(404).send('No user found.');
    return true;
}

const IsAuthenticated = (req,res,next) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
    });

    req.user_id = decoded.id;
    next();
  });
}
// CREATES A NEW Todo
router.post('/', IsAuthenticated, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user_id},
        {$push: {todos: {title: req.body.title, completed: false}}},
        {new: true},
        (err, user) => {
            if (err) res.status(500).send('Error creating the todo');
            res.status(200).send(user.todos);
        }
    )
});

//gets all todos for loggedin user
router.get('/', IsAuthenticated, (req, res) => {
    User.findOne().where({_id: req.user_id}).exec( (err, user) => {
        if (!EnsureUser(err,user,res)) return;

        res.status(200).send(user.todos);
    });
});

// gets a single todo
router.get('/:id', IsAuthenticated, (req, res) => {
    User.findOne().where({_id: req.user_id}).exec( (err, user) => {
        if (!EnsureUser(err, user, res)) return;

        res.status(200).send(user.todos.id({_id: req.params.id}));
    });
});

// deletes a todo from the database
router.delete('/:id', IsAuthenticated, (req, res) => {
    User.findOne().where({_id: req.user_id}).exec( (err, user) => {
        if (!EnsureUser(err, user, res)) return;

        let todo = user.todos.pull(req.params.id);
        if (!todo) return res.status(404).send('Todo Not Found.');

        user.save((err,user) => {
            if (err) return re.status(500).send('User could not be saved');
            return res.status(200).send(user);
        })
    });
});

// updates a single todo from the database
router.put('/:id', IsAuthenticated, (req, res) => {
    User.findOneAndUpdate(
        { "_id": req.user_id, "todos._id": req.params.id },
        { 
            "$set": {
                "todos.$.title": req.body.title,
                "todos.$.completed": req.body.completed,
            }
        }, {new: true},
        (err,user) => {
            if (err) return res.status(500).send("Todo could not me saved");
            return res.status(200).send(user);
        }
    );
});


module.exports = router;
