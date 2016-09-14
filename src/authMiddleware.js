const authHeader = require('auth-header');
const jwt = require('jsonwebtoken');

const config = require('./config');
const errorHelper = require('./errorHelper');

module.exports = function IsAuthenticated(req, res, next) {
  const token = authHeader.parse(req.get('authorization')).token;
  jwt.verify(token, config.SECRET, (err, tokenData) => {
    if (err) {
      errorHelper(res, 401)(new Error('Not authorized'));
    } else {
      req.user = tokenData;
      next();
    }
  });
};
