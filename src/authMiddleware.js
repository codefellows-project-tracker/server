const authHeader = require('auth-header');
const jwt = require('jsonwebtoken');

const config = require('./config');
const errorHelper = require('./errorHelper');

module.exports = function(...roles) {
  return function IsAuthenticated(req, res, next) {
    const header = req.get('authorization');
    if (!header) {
      return errorHelper(res, 401)(new Error('Not Authorization header'));
    }

    const token = authHeader.parse(header).token;
    jwt.verify(token, config.SECRET, (err, tokenData) => {
      if (err) {
        errorHelper(res, 401)(new Error('Not authorized'));
      } else {
        if (tokenData.role === 'admin') {
          req.user = tokenData;
          return next();
        } else if (roles.includes(tokenData.role)) {
          req.user = tokenData;
          return next();
        }
        return errorHelper(res, 401)(new Error('Not authorized'));
      }
    });
  };
};