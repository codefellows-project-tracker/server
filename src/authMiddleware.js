const authHeader = require('auth-header');
const jwt = require('jsonwebtoken');

const config = require('./config');
const errorHelper = require('./errorHelper');
const User = require('./models/user');
const Project = require('./models/project');

module.exports = function(roles, model) {
  return function IsAuthenticated(req, res, next) {
    function unauthorized() {
      return errorHelper(res, 401)(new Error('Not Authorization'));
    }

    const header = req.get('authorization');
    if (!header) {
      return unauthorized();
    }

    const token = authHeader.parse(header).token;
    jwt.verify(token, config.SECRET, (err, tokenData) => {
      if (err) {
        return unauthorized();
      }

      if (tokenData.role === 'admin') {
        req.user = tokenData;
        return next();
      } else if (roles.includes(tokenData.role)) {
        if (model === 'user') {
          User.findOne({ _id: tokenData._id })
            .then((user) => {
              if (!user) {
                return unauthorized();
              }

              if (user._id.toString() !== tokenData._id) {
                return unauthorized();
              }

              req.user = tokenData;
              return next();
            })
            .catch(unauthorized);
        } else if (model === 'project') {
          Project.findOne({ _id: req.params.id })
            .then((project) => {
              if (!project) {
                return unauthorized();
              }

              if (project.users.indexOf(tokenData._id) === -1) {
                return unauthorized();
              }

              req.user = tokenData;
              return next();
            })
            .catch(unauthorized);
        }

        req.user = tokenData;
        return next();
      }

      return unauthorized();
    });
  };
};
