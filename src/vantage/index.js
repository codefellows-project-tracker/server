const Vantage = require('vantage');

const config = require('../config');

const vantage = new Vantage();

vantage.auth('basic', {
  users: [
    {
      user: config.VANTAGE_USERNAME,
      pass: config.VANTAGE_PASSWORD,
    },
  ],
  retry: 3,
  retryTime: 500,
  deny: 1,
  unlockTime: 3000,
});

// Load vantage commands
require('./user')(vantage);

module.exports = vantage;
