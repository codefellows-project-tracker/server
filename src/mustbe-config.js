const jwt = require('jsonwebtoken');
const authHeader = require('auth-header');
const boom = require('boom');

const config = require('./config');
const User = require('./models/user');
const Project = require('./models/project');

module.exports = function(mustbeConfig) {
  mustbeConfig.routeHelpers((rh) => {
    rh.getUser((req, cb) => {
      const token = authHeader.parse(req.get('authorization')).token;
      if (!token) {
        return cb(boom.unauthorized('Authentication token does not exist'));
      }

      return jwt.verify(token, config.SECRET, (err, tokenData) => {
        if (err) {
          return cb(boom.unauthorized('JWT Token invalid'));
        }

        return User.findOne({ _id: tokenData._id })
          .then((user) => {
            cb(null, user);
          })
          .catch(() => {
            cb(boom.unauthorized('Mongo query error'));
          });
      });
    });

    rh.notAuthorized((req, res) => {
      res.status(401).json({ message: 'Not Authorized' });
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

      return cb(null, false);
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
            return cb(null, false);
          }

          if (project.users.indexOf(identity.user._id.toString()) === -1) {
            return cb(null, false);
          }

          return cb(null, true);
        })
        .catch(() => cb(null, false));
    });
  });
};
