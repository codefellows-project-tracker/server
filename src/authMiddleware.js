const authHeader = require('auth-header');
const jwt = require('jsonwebtoken');

const config = require('./config');
const errorHelper = require('./errorHelper');
const User = require('./models/user');
const Project = require('./models/project');

module.exports = function(roles, model) {
  return function IsAuthenticated(req, res, next) {
    const header = req.get('authorization');
    if (!header) {
      return errorHelper(res, 401)(new Error('Not Authorization header'));
    }

    const token = authHeader.parse(header).token;
    jwt.verify(token, config.SECRET, (err, tokenData) => {
      if (err) {
        return errorHelper(res, 401)(new Error('Not authorized'));
      }

      if (tokenData.role === 'admin') {
        req.user = tokenData;
        return next();
      } else if (roles.includes(tokenData.role)) {
        if (model === 'user') {
          User.findOne({ _id: tokenData._id })
            .then((user) => {
              if (!user) {
                return errorHelper(res, 401)(new Error('Not authorized'));
              }

              if (user._id !== tokenData._id) {
                return errorHelper(res, 401)(new Error('Not authorized'));
              }

              req.user = tokenData;
              return next();
            })
            .catch(() =>
              errorHelper(res, 401)(new Error('Not authorized'))
            );
        } else if (model === 'project') {
          Project.findOne({ _id: req.params.id })
            .then((project) => {
              if (!project) {
                return errorHelper(res, 401)(new Error('Not authorized'));
              }

              if (project.users.indexOf(tokenData._id) === -1) {
                return errorHelper(res, 401)(new Error('Not authorized'));
              }

              req.user = tokenData;
              return next();
            })
            .catch(() =>
              errorHelper(res, 401)(new Error('Not authorized'))
            );
        }

        req.user = tokenData;
        return next();
      }

      return errorHelper(res, 401)(new Error('Not authorized'));
    });
  };
};
