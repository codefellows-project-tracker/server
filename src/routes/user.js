const express = require('express');

const User = require('../models/user');

const router = new express.Router();

router.get('/', (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch(() => {
      res.status(500).json({ message: 'ERROR!!!' });
    });
});
router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
  .then((user) => {
    res.json(user);
  });
});
router.post('/', (req, res) => {
  const user = new User(req.body);
  user.save()
  .then((newUser) => {
    res.json(newUser);
  });
});
router.put('/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch(() => {
    res.status(500).json({ message: 'ERROR!!!' });
  });
});
router.delete('/:id', (req, res) => {
  User.remove({ _id: req.params.id })
  .then((deleteUser) => {
    res.json(deleteUser);
  });
});
module.exports = router;
