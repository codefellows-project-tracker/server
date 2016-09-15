const express = require('express');

const User = require('../models/user');
const errorHelper = require('../errorHelper');

const router = new express.Router();

router.get('/', (req, res) => {
  User.find({})
    .select('-password')
    .then((users) => {
      res.json(users);
    })
    .catch(errorHelper(res, 500));
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      if (!user) {
        return errorHelper(res, 404)(new Error('User not found'));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.post('/', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then((newUser) => {
      newUser.password = undefined; // eslint-disable-line no-param-reassign
      res.json(newUser);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return errorHelper(res, 400, 'Duplicate key')(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.put('/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return errorHelper(res, 404)(new Error('User not found'));
      }
      updatedUser.password = undefined; // eslint-disable-line no-param-reassign
      return res.json(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.delete('/:id', (req, res) => {
  User.remove({ _id: req.params.id })
    .then((deleteUser) => {
      if (deleteUser.result.n === 0) {
        return errorHelper(res, 404)(new Error('User not found'));
      }
      return res.json(deleteUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

module.exports = router;

