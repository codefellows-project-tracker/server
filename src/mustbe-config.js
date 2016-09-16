const jwt = require('jsonwebtoken');
const authHeader = require('auth-header');
const boom = require('boom');

const config = require('./config');
const User = require('./models/user');
const Project = require('./models/project');

module.exports = function(mustbeConfig) {
  mustbeConfig.routeHelpers((rh) => {
    rh.getUser((req, cb) => {
      const header = req.get('authorization');
      if (!header) {
        return cb(boom.unauthorized('Authentication header does not exist'));
      }

      let token;
      try {
        token = authHeader.parse(header).token;
      } catch (err) {
        return cb(boom.unauthorized('Authentication header is malformed'));
      }

      return jwt.verify(token, config.SECRET, (err, tokenData) => {
        if (err) {
          return cb(boom.unauthorized('JWT Token invalid'));
        }

        return User.findOne({ _id: tokenData._id })
          .then((user) => {
            if (!user) {
              return cb(boom.unauthorized('User does not exist'));
            }

            return cb(null, user);
          })
          .catch(() => {
            cb(boom.unauthorized('User does not exist'));
          });
      });
    });

    rh.parameterMaps((params) => {
      params.map('user', (req) => req.params);
      params.map('any-user', (req) => req.params);
      params.map('project', (req) => req.params);
    });
  });

  mustbeConfig.activities((activities) => {
    activities.can('user', (identity, params, cb) => {
      if (identity.user.role === 'admin') {
        return cb(null, true);
      } else if (identity.user._id.toString() === params.id) {
        return cb(null, true);
      }

      return cb(boom.unauthorized('User not found'));
    });

    activities.can('any-user', (identity, params, cb) => {
      cb(null, true);
    });

    activities.can('project', (identity, params, cb) => {
      if (identity.user.role === 'admin') {
        return cb(null, true);
      }

      return Project.findOne({ _id: params.id })
        .then((project) => {
          if (!project) {
            return cb(boom.notFound('Project does not exist'));
          }

          if (project.users.indexOf(identity.user._id.toString()) === -1) {
            return cb(boom.unauthorized('Insuffiecnt permission'));
          }

          return cb(null, true);
        })
        .catch(() => cb(boom.notFound('Invalid project id')));
    });
  });
};
