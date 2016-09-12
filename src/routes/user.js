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

module.exports = router;
